import { Injectable } from '@nestjs/common';
import DocumentStore, { IDocumentStore } from 'ravendb';

@Injectable()
export class DataStorageService {
    private readonly documentStore: IDocumentStore;
    constructor() {
        const store = new DocumentStore(`http://0.0.0.0:8080`, 'scholaris_db').initialize();
        this.documentStore.conventions.registerEntityType()
    }
}
