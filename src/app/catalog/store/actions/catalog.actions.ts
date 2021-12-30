import {ProcessModel} from '../../../models/domain/process.model';

export namespace CatalogActions {

  export class ProcessFetched {
    static readonly type = '[ProcessService] ProcessFetched';

    constructor(public currentProcess: ProcessModel) {
    }
  }

  export class ProcessActiveResourceXmlContentPatched {
    static readonly type = 'ProcessActiveResourceXmlContentPatched';

    constructor(public content: string) {
    }
  }

}
