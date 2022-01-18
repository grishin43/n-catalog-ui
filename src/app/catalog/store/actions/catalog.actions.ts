import {ProcessModel} from '../../../models/domain/process.model';
import {ResourceTypeEnum} from '../../../models/domain/resource-type.enum';
import {ProcessVersionModel} from '../../../models/domain/process-version.model';

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

  export class ProcessNewVersionCreated {
    static readonly type = 'ProcessNewVersionCreated';

    constructor(public currentVersionId: string) {
    }
  }

}
