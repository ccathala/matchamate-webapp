import { DatePipe } from '@angular/common';
import { Slot } from './../_models/slot';
import { PlayerApiService } from './_api/player-api.service';
import { CompanyApiService } from './_api/company-api.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


const ID_KEY = 'user-id';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  href: string;
  id: string;

  constructor(private companyApi: CompanyApiService,
              private playerApi: PlayerApiService,
              private datePipe: DatePipe) {

  }

  saveUserIdKey(userId: string): void {
    window.localStorage.removeItem(ID_KEY);
    window.localStorage.setItem(ID_KEY, userId);
  }

  getUserIdKey(): string {
    return localStorage.getItem(ID_KEY);
  }

  getUserFromApis(roles: string[], email: string, onSuccess: () => void): void {
    if (roles.includes('ROLE_COMPANY')) {
      this.companyApi.getCompanyByEmail(email, () => {
        onSuccess();
      });
    } else if (roles.includes('ROLE_PLAYER')) {
      this.playerApi.getPlayerByEmail(email, () => {
        onSuccess();
      });
    }
  }

  getIdFromHref(roles: string[], href: string): string {
    if (roles.includes('ROLE_COMPANY')) {
      return href.substring(32);
    } else if (roles.includes('ROLE_PLAYER')) {
      return href.substring(30);
    }
  }

  getSubscriptionByRole(roles: string[]): Subject<any> {
    if (roles.includes('ROLE_COMPANY')) {
      return this.companyApi.companySubject;
    } else if (roles.includes('ROLE_PLAYER')) {
      return this.playerApi.playerSubject;
    }
  }

  /**
   * Generate daySchedule from company object weekSchedule property and dayName parameter
   *
   */
  generateCompanyDaySchedule(weekSchedule: any[], dayIndex: number, date: Date): Slot[] {
    // Init output list
    const dayScheduleList: Slot[] = [];

    // Loop for to find needed day
    for (const daySchedule of weekSchedule) {

      // when day is set
      if (daySchedule.dayIndex === dayIndex) {
        // Get hour values for opening/closing time
        let openingTime = this.formatHoursToNumber(daySchedule.openingTime);
        const closingTime = this.formatHoursToNumber(daySchedule.closingTime);

        const currentDateString = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        const selectedDateString = this.datePipe.transform(date, 'yyyy-MM-dd');

        if (currentDateString === selectedDateString) {
          openingTime = +this.datePipe.transform(new Date(), 'H') + 2;
        }

        // Generate day schedule
        for (let j = openingTime; j < closingTime; j++) {
          const slot = new Slot();
          if (j < 10) {
            slot.display = '0' + j + ':00';
          } else {
            slot.display = j + ':00';
          }
          slot.value = j;
          slot.isFree = true;
          slot.userSubscribed = false;
          dayScheduleList.push(slot);
        }
      }

    }
    return dayScheduleList;
  }

  /**
   * Format hour string hh:00 to number hh
   */
  formatHoursToNumber(hour: string): number {
    let splitedHour: string[];
    let formatedHour: number;
    splitedHour = hour.split(':', 1);
    formatedHour = +splitedHour[0];
    return formatedHour;

  }

  /**
   * Format number to hour hh:00
   */
  formatNumberToHour(numberValue: number): string {
    if (numberValue < 10) {
      return '0' + numberValue + ':00';
    } else {
      return numberValue + ':00';
    }
  }

  /**
   * Format number to two digits string
   */
  formatNumberToStringWithTwoDigits(numberValue: number): string {
    if (numberValue < 10) {
      return '0' + numberValue;
    } else {
      return numberValue.toString();
    }
  }

  /**
   * Format date to utc string and add timezone offset
   */
  formatDateToUtcString(date: Date): string {
    return date.toUTCString();
  }

  /**
   * Format date to iso string and add timezone offset
   */
  formatDateToIsoString(date: Date): string {
    return date.toISOString();
  }

  /**
   * Add time offset to a date
   */
  addTimezoneOffsetToADate(date: Date): Date {
    const offset: number = date.getTimezoneOffset() / 60;
    const dateHours: number = date.getHours();
    date.setHours(dateHours + offset);
    return date;
  }

  /**
   * Check if user is not already booked in session, return true if verified
   */
  checkUserIsNotBookedInSession(participants: any[], userEmail): boolean {
    let userIsNotBookedInSession: boolean;
    userIsNotBookedInSession = participants.some(e => e.email === userEmail);
    if (!userIsNotBookedInSession) {
      console.error('L\'utilisateur est déjà inscrit à la session');
    }
    return userIsNotBookedInSession;
  }
}
