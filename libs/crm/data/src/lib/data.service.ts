import { ServiceAccountConfig } from '@crm/core';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';

@Injectable()
export class DataService implements OnModuleInit, OnModuleDestroy {
  #doc: GoogleSpreadsheet;

  constructor(private readonly config: ConfigService) {
    // super();
  }

  public async onModuleInit() {
    try {
      const serviceAccount = this.config.get<ServiceAccountConfig>('serviceAccount');
      if (!serviceAccount) {
        throw new Error('Service account is not configured');
      }

      const docId = this.config.get<string>('sheetId');
      const doc = new GoogleSpreadsheet(docId);

      await doc.useServiceAccountAuth({
        client_email: serviceAccount.clientEmail,
        private_key: serviceAccount.privateKey,
      });

      await doc.loadInfo();

      console.log('Sheet count: ', doc.sheetCount);

      this.#doc = doc;
    } catch (error) {
      console.log('Could not initialize DataService');
      throw error;
    }

    // More specific init needed?
    Logger.log('DataService client connected'); // Example of logging
  }

  public async onModuleDestroy() {
    // await this.$disconnect();
  }

  public async getSpreadsheetRows(sheetTitle: string): Promise<GoogleSpreadsheetRow[]> {
    // let spreadSheetRows: GoogleSpreadsheetRow[] = await this.cacheManager.get(sheetTitle);
    // if (spreadSheetRows) {
    //   Logger.debug(`Loading ${sheetTitle} from cache`);
    //   return spreadSheetRows;
    // }

    Logger.debug(`Loading ${sheetTitle} from database`);

    const spreadSheetRows = await this.#doc.sheetsByTitle[sheetTitle].getRows();
    // this.cacheManager.set(sheetTitle, spreadSheetRows, {
    //   ttl: CACHE_WORKSHEET_DEFAULT_TTL,
    // });
    return spreadSheetRows;
  }
}
