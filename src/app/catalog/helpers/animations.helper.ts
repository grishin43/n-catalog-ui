import {
  animate, AnimationGroupMetadata,
  AnimationQueryMetadata,
  AnimationTriggerMetadata,
  group,
  query,
  style,
  transition,
  trigger
} from '@angular/animations';

export class AnimationsHelper {

  public static get fadeInOut(): AnimationTriggerMetadata {
    return trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate(200, style({opacity: 1}))
      ]),
      transition(':leave', [
        animate(200, style({opacity: 0}))
      ])
    ]);
  }

  public static get slide(): AnimationTriggerMetadata[] {
    return [
      trigger('slide', [
        transition(':increment', AnimationsHelper.slideRight),
        transition(':decrement', AnimationsHelper.slideLeft),
      ]),
    ];
  }

  public static get slideLeft(): (AnimationQueryMetadata | AnimationGroupMetadata)[] {
    return [
      query(':enter, :leave', style({position: 'absolute'}), {optional: true}),
      group([
        query(':enter', [
          style({transform: 'translateX(-100%)', opacity: '0', visibility: 'hidden'}),
          animate('.3s ease-out', style({transform: 'translateX(0%)', opacity: '1', visibility: 'visible'}))
        ], {
          optional: true,
        }),
        query(':leave', [
          style({transform: 'translateX(0%)', opacity: '1', visibility: 'visible'}),
          animate('.3s ease-out', style({transform: 'translateX(100%)', opacity: '0', visibility: 'hidden'}))
        ], {
          optional: true,
        }),
      ]),
    ];
  }

  public static get slideRight(): (AnimationQueryMetadata | AnimationGroupMetadata)[] {
    return [
      query(':enter, :leave', style({position: 'absolute'}), {optional: true}),
      group([
        query(':enter', [
          style({transform: 'translateX(100%)', opacity: '0', visibility: 'hidden'}),
          animate('.3s ease-out', style({transform: 'translateX(0%)', opacity: '1', visibility: 'visible'}))], {
          optional: true,
        }),
        query(':leave', [
          style({transform: 'translateX(0%)', opacity: '1', visibility: 'visible'}),
          animate('.3s ease-out', style({transform: 'translateX(-100%)', opacity: '0', visibility: 'hidden'}))], {
          optional: true,
        }),
      ]),
    ];
  }

}
