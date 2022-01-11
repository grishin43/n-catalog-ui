import {ProcessModel} from '../../../models/domain/process.model';
import {ResourceTypeEnum} from '../../../models/domain/resource-type.enum';

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

  export class ProcessVersionsAvailabilityPatched {
    static readonly type = 'ProcessVersionsAvailabilityPatched';

    constructor(public hasVersions: boolean) {
    }
  }

  export class ProcessNewVersionCreated {
    static readonly type = 'ProcessNewVersionCreated';

    constructor(public currentVersionId: string) {
    }
  }

}
