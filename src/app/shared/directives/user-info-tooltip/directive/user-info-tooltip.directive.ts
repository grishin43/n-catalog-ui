import {ComponentRef, Directive, ElementRef, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {Overlay, OverlayPositionBuilder, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {UserInfoTooltipComponent} from '../component/user-info-tooltip.component';
import {ConnectedPosition} from '@angular/cdk/overlay/position/flexible-connected-position-strategy';
import {Subscription} from 'rxjs';
import {ApiService} from '../../../../catalog/services/api/api.service';
import {UserModel} from '../../../../models/domain/user.model';
import {HttpErrorResponse} from '@angular/common/http';

@Directive({
  selector: '[npUserInfoTooltip]'
})
export class UserInfoTooltipDirective implements OnInit, OnDestroy {
  @Input() npUserInfoTooltipUsername: string;
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

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
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

  private openTooltip(): void {
    if (this.overlayRef && !this.overlayRef.hasAttached()) {
      this.tooltipRef = this.overlayRef.attach(new ComponentPortal(UserInfoTooltipComponent));
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
    this.tooltipRef.instance.error = undefined;
    this.tooltipRef.instance.loader = true;
    this.subs.add(
      this.api.getUserInfo(this.npUserInfoTooltipUsername)
        .subscribe((res: UserModel) => {
          this.tooltipRef.instance.loader = false;
          this.tooltipRef.instance.user = res;
        }, (err: HttpErrorResponse) => {
          this.tooltipRef.instance.loader = false;
          this.tooltipRef.instance.error = err;
        })
    );
  }

  private closeToolTip(): void {
    this.overlayRef?.detach();
    this.mouseEntered = false;
  }

}
