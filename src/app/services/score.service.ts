import { Injectable, computed, signal } from "@angular/core";

export class Team {
    sets = [0, 0, 0, 0, 0];

    constructor(public name: string) { }
}

@Injectable({
    providedIn: "root"
})
export class MatchService {
    teamA = signal<Team>(new Team('Team A'));
    teamB = signal<Team>(new Team('Team B'));
    currentSet = signal(0);
    teamASets = computed<number>(() => this.#computeTeamSets(this.teamA(), this.teamB()));
    teamBSets = computed<number>(() => this.#computeTeamSets(this.teamB(), this.teamA()));

    teamACurrentSet = computed(() => this.teamA().sets[this.currentSet()]);
    teamBCurrentSet = computed(() => this.teamB().sets[this.currentSet()]);

    isSetWin = computed(() =>
        this.#isSetWin(this.teamA(), this.teamB(), this.currentSet())
    );

    isMatchWin = computed(() => {
        return this.teamASets() === 3 || this.teamBSets() === 3
    });

    constructor() {
        this.resetGame();
    }

    resetGame(): void {
        this.teamA.set(new Team('Team A'));
        this.teamB.set(new Team('Team B'));
        this.currentSet.set(0);
    }

    nextSet(): void {
        this.currentSet.update((score: number) => score + 1);
    }

    #isSetWin(team: Team, otherTeam: Team, set: number): boolean {
        const maxSetPoint = set === 4 ? 15 : 25;
        return (team.sets[set] >= maxSetPoint || otherTeam.sets[set] >= maxSetPoint) && Math.abs(team.sets[set] - otherTeam.sets[set]) > 1;
    }

    #computeTeamSets(team: Team, otherTeam: Team): number {
        let nbSet = 0;
        for (let i = 0; i <= this.currentSet(); i++) {
            if (this.#isSetWin(team, otherTeam, i) && team.sets[i] > otherTeam.sets[i]) {
                nbSet++;
            }
        }
        return nbSet;
    }
}