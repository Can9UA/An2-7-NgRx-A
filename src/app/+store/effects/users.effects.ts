import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// @Ngrx
import { Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { UsersActionTypes } from './../actions';
import * as UsersActions from './../actions/users.actions';
import * as RouterActions from './../actions/router.actions';

// Rxjs
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { switchMap, map, catchError } from 'rxjs/operators';

import { UserObservableService } from './../../users/services/user-observable.service';

@Injectable()
export class UsersEffects {

  @Effect() getUsers$: Observable<Action> = this.actions$
    .ofType(UsersActionTypes.GET_USERS)
    .pipe(
      switchMap(action =>
        this.userObservableService.getUsers()
        .pipe(
            map(users => new UsersActions.GetUsersSuccess(users)),
            catchError(err => of(new UsersActions.GetUsersError(err)))
        )
      )
    );

  @Effect() getUser$: Observable<Action> = this.actions$
    .ofType(UsersActionTypes.GET_USER)
    .pipe(
      map((action: UsersActions.GetUser) => action.payload),
      switchMap(payload =>
        this.userObservableService.getUser(payload)
        .pipe(
            map(user => new UsersActions.GetUserSuccess(user)),
            catchError(err => of(new UsersActions.GetUserError(err)))
        )
      )
    );

  @Effect() updateUser$: Observable<Action> = this.actions$
    .ofType(UsersActionTypes.UPDATE_USER)
    .pipe(
      map((action: UsersActions.UpdateUser) => action.payload),
      switchMap(payload =>
        this.userObservableService.updateUser(payload)
        .pipe(
            map(user => new UsersActions.UpdateUserSuccess(user)),
            catchError(err => of(new UsersActions.UpdateUserError(err)))
        )
      )
    );

  @Effect() createUser$: Observable<Action> = this.actions$
    .ofType(UsersActionTypes.CREATE_USER)
    .pipe(
      map((action: UsersActions.CreateUser) => action.payload),
      switchMap(payload =>
        this.userObservableService.createUser(payload)
        .pipe(
            map(user => new UsersActions.CreateUserSuccess(user)),
            catchError(err => of(new UsersActions.CreateUserError(err)))
        )
      )
    );

  @Effect() createUpdateUserSuccess$: Observable<Action> = this.actions$
    .ofType(
      UsersActionTypes.CREATE_USER_SUCCESS,
      UsersActionTypes.UPDATE_USER_SUCCESS
    )
    .pipe(
      map(action => new RouterActions.Go({
        path: ['/users']
      }))
    );

  @Effect() deleteUser$: Observable<Action> = this.actions$
    .ofType(UsersActionTypes.DELETE_USER)
    .pipe(
      map((action: UsersActions.DeleteUser) => action.payload),
      switchMap(payload =>
        this.userObservableService.deleteUser(payload)
        .pipe(
            // Note: json-server doesn't return deleted user
            map(() => new UsersActions.DeleteUserSuccess(payload)),
            catchError(err => of(new UsersActions.DeleteUserError(err)))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private userObservableService: UserObservableService,
    private router: Router
  ) {
    console.log('[USERS EFFECTS]');
  }

}
