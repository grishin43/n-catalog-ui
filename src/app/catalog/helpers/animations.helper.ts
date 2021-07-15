import {animate, AnimationTriggerMetadata, state, style, transition, trigger} from '@angular/animations';

export class AnimationsHelper {

  public static get fadeInOut(): AnimationTriggerMetadata {
    return trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(200, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate(200, style({ opacity: 0 }))
      ])
    ]);
  }

}
