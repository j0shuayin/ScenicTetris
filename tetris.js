export class tetris{
    constructor(){
        this.grid[14][22];
        for(let i = 0; i < 14; i++) {
            for(let j = 0; j < 22; j++) {
                if(i < 2 || i > 11 || j < 2) {
                    this.grid[i][j] = 1;
                }
                    
                else {
                    this.grid[i][j] = 0;
                }
                    
            }
        }
        this.score = 0;
        this.x = 5;
        this.y = 19;
        this.block = 0;
        this.rotation = 0;
        this.config[7][4][4][2] =  [[[[1,0],[1,1],[1,2],[1,3]],[[-1,2],[0,2],[1,2],[2,2]][[1,0],[1,1],[1,2],[1,3]],[[-1,2],[0,2],[1,2],[2,2]]],
                                    [[[1,0],[1,1],[1,2],[1,3]],[[-1,2],[0,2],[1,2],[2,2]][[1,0],[1,1],[1,2],[1,3]],[[-1,2],[0,2],[1,2],[2,2]]],
                                    [[[1,0],[1,1],[1,2],[1,3]],[[-1,2],[0,2],[1,2],[2,2]][[1,0],[1,1],[1,2],[1,3]],[[-1,2],[0,2],[1,2],[2,2]]],
                                    [[[1,0],[1,1],[1,2],[1,3]],[[-1,2],[0,2],[1,2],[2,2]][[1,0],[1,1],[1,2],[1,3]],[[-1,2],[0,2],[1,2],[2,2]]],
                                    [[[1,0],[1,1],[1,2],[1,3]],[[-1,2],[0,2],[1,2],[2,2]][[1,0],[1,1],[1,2],[1,3]],[[-1,2],[0,2],[1,2],[2,2]]],
                                    [[[1,0],[1,1],[1,2],[1,3]],[[-1,2],[0,2],[1,2],[2,2]][[1,0],[1,1],[1,2],[1,3]],[[-1,2],[0,2],[1,2],[2,2]]],
                                    [[[1,0],[1,1],[1,2],[1,3]],[[-1,2],[0,2],[1,2],[2,2]][[1,0],[1,1],[1,2],[1,3]],[[-1,2],[0,2],[1,2],[2,2]]],];

    }
    checkcollision(x, y, rotation) {
        for(let i = 0; i < 4; i++) {
            if(this.grid[x+this.config[this.block][rotation][i][0]][y+this.config[this.block][rotation][i][1]] == 1) {
                return false;
            }
        }
        return true;
    }
    clearlines() {
        for(let y = 2; y < 22; y++) {
            let fullLine = true;
            for(let x = 2; x < 12; x++) {
                if(this.grid[x][y] == 0) 
                    fullLine = false;
            }
            if(fullLine) {
                for(let i = 2; i < 12; i++) 
                    this.grid[i][y] = 0;
                
                for(let j = y+1; j < 21; j++) {
                    for(let i = 2; i < 12; i++) {
                        this.grid[i][j] = this.grid[i][j+1];
                    }
                }
                for(let i = 2; i < 12; i++) 
                    this.grid[i][19] = 0;
                this.score++;
            }
        }
    }
    placeblock() {
        for(let i = 0; i < 4; i++) {
            this.grid[this.x+this.config[this.block][this.rotation][i][0]][this.y+this.config[this.block][this.rotation][i][1]] = 1;
        }
        this.x = 5;
        this.y = 19;
        this.block = Math.floor(Math.random()*7);
        this.rotation = 0;
    }
    tick() {
        if(checkcollision(this.x, this.y-1, this.rotation)) {
            this.y--;
        } else {
            this.placeblock();
            this.clearlines();
        }
    }
    moveleft() {
        if(checkcollision(this.x-1, this.y, this.rotation))
            this.x--;
    }
    moveright() {
        if(checkcollision(this.x+1, this.y, this.rotation))
            this.x++;
    }
    movedown() {
        if(checkcollision(this.x, this.y-1, this.rotation))
            this.y--;
    }
    rotatecw() {
        let newRotation = (this.rotation+1)%4;
        if(this.checkcollision(this.x, this.y, newRotation)) {
            this.rotation = newRotation;
        }
    }
    rotateccw() {
        let newRotation = (this.rotation-1)%4;
        if(this.checkcollision(this.x, this.y, newRotation)) {
            this.rotation = newRotation;
        }
    }
}