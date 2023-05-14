import { Injectable, computed, signal } from "@angular/core";

export class Team {
    sets = [0,0,0,0,0];
    
    constructor(private name: string){}
}

@Injectable({
    providedIn: "root"
})
export class MatchService {
    teamA = signal<Team>(new Team('Team A'));
    teamB = signal<Team>(new Team('Team B'));
    currentSet = signal(0);
    teamASets = signal(0);
    teamBSets = signal(0);

    teamACurrentSet = computed(() => this.teamA().sets[this.currentSet()]);
    teamBCurrentSet = computed(() => this.teamB().sets[this.currentSet()]);

    isSetWin = computed(() => {
        const teamA = this.teamACurrentSet();
        const teamB = this.teamBCurrentSet();
        const maxSetPoint = this.currentSet() === 5 ? 15 : 25;
        return (teamA >= maxSetPoint || teamB >= maxSetPoint) && Math.abs(teamA - teamB) > 1
    });

    isMatchWin = computed(() => {
        const t = this.teamA();
        const t2 = this.teamB();
        return this.isSetWin() && Math.abs(this.teamASets() - this.teamBSets()) === 3;
    });

    resetGame(): void {
        this.teamA.set(new Team('Team A'));
        this.teamB.set(new Team('Team B'));
        this.currentSet.set(0);
    }

    nextSet(): void {
        this.updateWinSet();
        this.currentSet.update(this.plusUn);
    }

    updateWinSet(): void {
        if (this.teamA().sets[this.currentSet()] > this.teamB().sets[this.currentSet()]) {
            this.teamASets.mutate(this.plusUn);
        } else {
            this.teamBSets.update(this.plusUn);
        }
    }

    plusUn = (score: number) => score + 1;
}