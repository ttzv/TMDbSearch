export class Genre {
    
    id: number;
    name: string;

    toString(): string{
        return this.name;
    }

    compareTo(g2: Genre): number {
        if(this.name === g2.name) return 0;
        if(this.name > g2.name) return -1;
        return 1;
      }
}
