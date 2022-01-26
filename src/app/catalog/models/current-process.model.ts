import {ProcessVersionModel} from '../../models/domain/process-version.model';
import {ProcessModel} from '../../models/domain/process.model';

export interface CurrentProcessModel extends ProcessModel {
  isLocked?: boolean;
  currentVersionId?: string;
  versions?: ProcessVersionModel[];
  canDiscardChanges?: boolean;
  blocked?: boolean; // await generation update
}
