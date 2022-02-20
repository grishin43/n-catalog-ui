import {ComponentRef, Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {Overlay, OverlayPositionBuilder, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {UserInfoTooltipComponent} from '../component/user-info-tooltip.component';
import {ConnectedPosition} from '@angular/cdk/overlay/position/flexible-connected-position-strategy';
import {ApiService} from '../../../../services/api/api.service';
import {Subscription} from 'rxjs';
import {WorkgroupUserModel} from '../../../../../models/domain/user.model';
import {HttpErrorResponse} from '@angular/common/http';

@Directive({
  selector: '[npUserInfoTooltip]'
})
export class UserInfoTooltipDirective implements OnInit, OnDestroy {
  @Input() id: string;

  private positions: ConnectedPosition[] = [
    {
      originX: 'center',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom',
      panelClass: 'padding-10'
    },
    {
      originX: 'center',
      originY: 'bottom',
      overlayX: 'center',
      overlayY: 'top',
      panelClass: 'padding-10'
    },
    {
      originX: 'start',
      originY: 'center',
      overlayX: 'end',
      overlayY: 'center',
      panelClass: 'padding-10'
    },
    {
      originX: 'end',
      originY: 'center',
      overlayX: 'start',
      overlayY: 'center',
      panelClass: 'padding-10'
    }
  ];
  private overlayRef: OverlayRef;
  private tooltipRef: ComponentRef<UserInfoTooltipComponent>;
  private subs = new Subscription();
  private mouseEntered: boolean;

  @HostListener('mouseenter')
  mouseenter(): void {
    this.openTooltip();
  }

  @HostListener('mouseleave')
  mouseleave(): void {
    setTimeout(() => {
      if (!this.mouseEntered) {
        this.closeToolTip();
      }
    }, 50);
  }

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private viewContainerRef: ViewContainerRef,
    private elementRef: ElementRef,
    private api: ApiService) {
  }

  ngOnInit(): void {
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions(this.positions)
      .withPush(true);
    this.overlayRef = this.overlay.create({positionStrategy});
  }

  ngOnDestroy(): void {
    this.closeToolTip();
  }

  private openTooltip(): void {
    if (this.overlayRef && !this.overlayRef.hasAttached()) {
      this.tooltipRef = this.overlayRef.attach(new ComponentPortal(UserInfoTooltipComponent, this.viewContainerRef));
      this.addTooltipEventListeners();
      this.getUserInfo();
    }
  }

  private addTooltipEventListeners(): void {
    this.tooltipRef.location.nativeElement.addEventListener('mouseenter', () => {
      this.mouseEntered = true;
    });
    this.tooltipRef.location.nativeElement.addEventListener('mouseleave', () => {
      this.closeToolTip();
    });
  }

  private getUserInfo(): void {
    this.tooltipRef.instance.user = undefined;
    this.tooltipRef.instance.error = undefined;
    this.tooltipRef.instance.loading = true;
    this.subs.add(
      this.api.getUserInfo(this.id)
        .subscribe((res: WorkgroupUserModel) => {
          this.tooltipRef.instance.user = res;
          this.tooltipRef.instance.loading = false;
        }, (err: HttpErrorResponse) => {
          this.tooltipRef.instance.error = err;
          this.tooltipRef.instance.loading = false;
        })
    );
  }

  private closeToolTip(): void {
    this.overlayRef?.detach();
    this.mouseEntered = false;
  }

}
