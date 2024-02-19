import { NgClass, NgTemplateOutlet, SlicePipe } from '@angular/common';
import { Component, DestroyRef, Injector, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormArray, FormControl, FormGroup, FormRecord, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ICountryData, TCountryCode, getCountryDataList, getEmojiFlag } from 'countries-list';
import { MessageService, TreeNode } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TreeSelectModule } from 'primeng/treeselect';
import { map, of } from 'rxjs';
import { InstitutionService } from '../../state/services/institution.service';
import { UtilService } from '../../state/services/util.service';
import { PhoneNumberUtil } from 'google-libphonenumber';

function institutionAvailabilityValidator(injector: Injector) {
  const institutionService = injector.get(InstitutionService);
  return (control: AbstractControl) => {
    if (!control.value) return of(null);
    return institutionService.checkIfInstitutionNameIsAvailable(control.value).pipe(
      map(val => {
        if (val) return null;
        return { nameUnavailable: true } as ValidationErrors;
      })
    );
  };
}

@Component({
  selector: 'app-new-institution-page',
  standalone: true,
  imports: [
    StepsModule,
    CardModule,
    ToggleButtonModule,
    TreeSelectModule,
    FormsModule,
    NgTemplateOutlet,
    ReactiveFormsModule,
    TreeSelectModule,
    KeyFilterModule,
    ButtonModule,
    InputGroupModule,
    SlicePipe,
    ToastModule,
    AutoCompleteModule,
    NgClass,
    InputTextModule
  ],
  templateUrl: './new-institution-page.component.html',
  styleUrl: './new-institution-page.component.scss',
  providers: [MessageService, {
    provide: PhoneNumberUtil,
    useValue: PhoneNumberUtil.getInstance(),
    multi: false
  }]
})
export class NewInstitutionPageComponent implements OnInit {
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly utilService = inject(UtilService);
  private readonly messageService = inject(MessageService);
  private readonly phoneUtil = inject(PhoneNumberUtil);
  private readonly institutionService = inject(InstitutionService);

  readonly form = new FormGroup({
    name: new FormControl<string>('', { validators: [Validators.required], asyncValidators: [institutionAvailabilityValidator(this.injector)] }),
    useCurrentLocation: new FormControl(false),
    location: new FormRecord({}),
    slug: new FormControl<string>(''),
    contacts: new FormGroup({
      emails: new FormArray(Array<FormControl<string | null>>()),
      phoneNumbers: new FormArray(Array<FormGroup>())
    })
  });

  private readonly countries = signal(getCountryDataList());
  private readonly countryFilterQuery = signal('');
  private readonly locationStateHistroyValue = signal<any>({});

  readonly phoneCodes = computed(() => {
    return this.countries().map(country => {
      return {
        label: `(+${country.phone[0]}) ${country.native}`,
        key: country.iso2,
        data: country.phone[0]
      } as TreeNode
    })
  })

  readonly filteredCountries = computed(() => {
    if (!this.countryFilterQuery()) return this.countries();

    const regex = new RegExp(this.countryFilterQuery(), 'ig');
    return this.countries().filter(({ name, native, iso3 }) => {
      const challenge = [native, name, iso3].join('|');
      return regex.test(challenge);
    }).sort((a, b) => {
      return a.native.localeCompare(b.native);
    });
  });

  onFilterCountries({ query }: { query: string }) {
    this.countryFilterQuery.set(query);
  }

  ngOnInit() {
    this.form.controls.useCurrentLocation.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(val => {
      this.useCurrentLocationValueChangeCallback(val);
    });

    this.form.controls.location.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(val => {
      this.locationStateHistroyValue.set(val);
    });

    this.form.controls.contacts.controls.phoneNumbers.valueChanges.subscribe(() => {
      this.form.controls.contacts.controls.phoneNumbers.controls.forEach(group => {
        console.log(group.errors);
      })
    });

    if (this.form.controls.useCurrentLocation.value) {
      this.updateAutoLocationFields();
    }

    this.useCurrentLocationValueChangeCallback(this.form.controls.useCurrentLocation.value);
  }

  private useCurrentLocationValueChangeCallback(value: boolean | null) {
    if (!value) {
      this.form.controls.location.addControl('line1', new FormControl<string>('', { validators: [Validators.required] }));
      this.form.controls.location.addControl('city', new FormControl<string>('', { validators: [Validators.required] }));
      this.form.controls.location.addControl('country', new FormControl<ICountryData | null>(null, { validators: [Validators.required] }));
      this.form.controls.location.addControl('line2', new FormControl<string>(''));
      this.form.controls.location.removeControl('lat');
      this.form.controls.location.removeControl('lon');
    } else {
      this.form.controls.location.removeControl('line1');
      this.form.controls.location.removeControl('line2');
      this.form.controls.location.removeControl('city');
      this.form.controls.location.removeControl('country');

      const latControl = new FormControl<number>(0, { validators: [Validators.min(-90), Validators.max(90)] });
      const lonControl = new FormControl<number>(0, { validators: [Validators.min(-180), Validators.max(180)] });

      this.form.controls.location.addControl('lat', latControl);
      this.form.controls.location.addControl('lon', lonControl);
      this.updateAutoLocationFields();
    }

    this.form.controls.location.patchValue(this.locationStateHistroyValue());
  }

  private updateAutoLocationFields() {
    this.utilService.getGeolocationIfPossible().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: ({ lat, lon }) => {
        this.form.controls.location.controls['lat']?.setValue(lat);
        this.form.controls.location.controls['lon']?.setValue(lon);
      },
      error: (error: Error) => {
        this.form.controls.useCurrentLocation.setValue(false);
        setTimeout(() => {
          return this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message
          });
        }, 5);
      }
    });
  }

  removeEmailContact(index: number) {
    this.form.controls.contacts.controls.emails.removeAt(index);
  }

  addEmailContact() {
    this.form.controls.contacts.controls.emails.push(new FormControl<string>('', { validators: [Validators.required, Validators.email] }));
  }

  addPhoneContact() {
    const validator = (group: AbstractControl) => {
      const codeControl = group.get('code') as AbstractControl;
      const numberControl = group.get('number') as AbstractControl;

      if (!numberControl.value) return null;
      try {
        const isValid = this.phoneUtil.isValidNumberForRegion(this.phoneUtil.parse(numberControl.value, codeControl.value?.key), codeControl.value?.key);
        return isValid ? null : { invalidPhoneNumber: true };
      } catch (error) {
        return { invalidPhoneNumber: true };
      }
    }
    this.form.controls.contacts.controls.phoneNumbers.push(new FormGroup({
      code: new FormControl<TreeNode<number> | null>(null, { validators: [Validators.required] }),
      number: new FormControl<string | null>('', { validators: [Validators.required] })
    }, { validators: [validator] }));
  }

  removePhoneContact(index: number) {
    this.form.controls.contacts.controls.phoneNumbers.removeAt(index);
  }

  onFormSubmit() {
    const { contacts, location, name, useCurrentLocation } = this.form.value;
    if(useCurrentLocation) {

    }
  }
}
