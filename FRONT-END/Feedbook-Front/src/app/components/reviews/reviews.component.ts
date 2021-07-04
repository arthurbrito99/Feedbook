import { evaluationVoteRequested } from './../../stores/subject/subject.actions';
import { first } from 'rxjs/operators';
import { getLoggedUser } from './../../stores/auth/auth.selectors';
import { UserData } from './../../models/auth';
import { getEvaluations } from './../../stores/subject/subject.selectors';
import { AppState } from './../../stores/reducers';
import { EvaluationData } from './../../models/subject';
import { Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit, OnDestroy {
  @Input() visible: boolean = false;
  @Output() whenCloseEvaluations: EventEmitter<boolean> = new EventEmitter<boolean>();

  public evaluations$: Observable<EvaluationData[]>;
  public loggedUser: UserData;

  constructor(
    private store: Store<AppState>,
  ) { }

  close() {
    this.visible = false;
    this.whenCloseEvaluations.emit(true);
  }

  public upVote(item: EvaluationData){
    if(item.evaluation_upvoted || item.evaluation_downvoted) { return; }
    this.store.dispatch(evaluationVoteRequested({ userId: this.loggedUser.user.id, evaluationId: item.evaluation_id, voteType: 'up', token: this.loggedUser.token }));
  }

  public downVote(item: EvaluationData){
    if(item.evaluation_upvoted || item.evaluation_downvoted) { return; }
    this.store.dispatch(evaluationVoteRequested({ userId: this.loggedUser.user.id, evaluationId: item.evaluation_id, voteType: 'down', token: this.loggedUser.token }));
  }

  async ngOnInit() {
    this.loggedUser = await this.store.select(getLoggedUser).pipe(first()).toPromise();
    this.evaluations$ = this.store.select(getEvaluations);
    this.visible = true;
  }

  ngOnDestroy(): void {
    this.visible = false;
  }

}
