import {CurrentProcessModel} from '../../models/current-process.model';
import {ResourceTypeEnum} from '../../../models/domain/resource-type.enum';
import {ProcessVersionModel} from '../../../models/domain/process-version.model';

export namespace CatalogActions {

  export class CurrentProcessCleared {
    static readonly type = 'CurrentProcessCleared';

    constructor() {
    }
  }

  export class ProcessFetched {
    static readonly type = '[ProcessService] ProcessFetched';

    constructor(public currentProcess: CurrentProcessModel) {
    }
  }

  export class ProcessActiveResourceXmlContentPatched {
    static readonly type = 'ProcessActiveResourceXmlContentPatched';

    constructor(public content: string) {
    }
  }

  export class ProcessResourcePatched {
    static readonly type = 'ProcessResourcePatched';

    constructor(public content: string, public type: ResourceTypeEnum) {
    }
  }

  export class ProcessGenerationPatched {
    static readonly type = 'ProcessGenerationPatched';

    constructor(public generation: number) {
    }
  }

  export class ProcessVersionsPatched {
    static readonly type = 'ProcessVersionsPatched';

    constructor(public versions: ProcessVersionModel[]) {
    }
  }

  export class ProcessVersionOpened {
    static readonly type = 'ProcessVersionOpened';

    constructor(public currentVersionId: string) {
    }
  }

  export class ProcessDiscardChangesPatched {
    static readonly type = 'ProcessDiscardChangesPatched';

    constructor(public flag: boolean) {
    }
  }

  export class ProcessNameChanged {
    static readonly type = 'ProcessNameChanged';

    constructor(public name: string) {
    }
  }

  export class BlockProcess {
    static readonly type = 'BlockProcess';

    constructor() {
    }
  }

  export class UnblockProcess {
    static readonly type = 'UnblockProcess';

    constructor() {
    }
  }

  export class CurrentProcessClosed {
    static readonly type = 'CurrentProcessClosed';

    constructor() {
    }
  }

}
