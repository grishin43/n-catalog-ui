import {CurrentProcessModel} from '../../models/current-process.model';

export namespace ProcessActions {

  export class ProcessesFetched {
    static readonly type = '[ProcessService] ProcessesFetched';

    constructor(public processes: CurrentProcessModel[]) {
    }
  }

  export class FolderProcessesFetched {
    static readonly type = '[FolderService] FolderProcessesFetched';

    constructor(public processes: CurrentProcessModel[], public parentFolderId: string) {
    }
  }

  export class DraftProcessCreated {
    static readonly type = '[ProcessService] DraftProcessCreated';

    constructor(public draftProcess: CurrentProcessModel, public correlationId) {
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

  export class ProcessMarkedToBeDeleted {
    static readonly type = 'ProcessMarkedToBeDeleted';

    constructor(public processId: string) {
    }
  }

  export class ProcessRevertToBeDeleted {
    static readonly type = 'ProcessRevertToBeDeleted';

    constructor(public processId: string) {
    }
  }

}
