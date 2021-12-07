import {ProcessModel} from '../../../models/domain/process.model';

export namespace ProcessActions {

  export class ProcessesFetched {
    static readonly type = '[ProcessService] ProcessesFetched';

    constructor(public processes: ProcessModel[]) {
    }
  }

  export class DraftProcessCreated {
    static readonly type = '[ProcessService] DraftProcessCreated';

    constructor(public draftProcess: ProcessModel, public correlationId) {
    }
  }

  export class ProcessDeleted {
    static readonly type = '[ProcessService] ProcessDeleted';

    constructor(public processId: string) {
    }
  }

  export class ProcessRenamed {
    static readonly type = '[ProcessService] ProcessRenamed';

    constructor(public processId: string, public newName: string) {
    }
  }

}
