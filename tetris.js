export class tetris{
    constructor(){
        this.grid = [];
        for(let i = 0; i < 14; i++) 
            this.grid[i] = [];
        for(let i = 0; i < 14; i++) {
            for(let j = 0; j < 24; j++) {
                if(i < 2 || i > 11 || j < 2) {
                    this.grid[i][j] = -1;
                }
                    
                else {
                    this.grid[i][j] = -1;
                }
                    
            }
        }
        this.score = 0;
        this.x = 6;
        this.y = 19;
        this.block = 0;
        this.rotation = 0;

        //order of pieces: IOTLJSZ
        this.config =  [
            [[[-1,2],[0,2],[1,2],[2,2]],[[1,0],[1,1],[1,2],[1,3]],[[-1,1],[0,1],[1,1],[2,1]],[[1,0],[1,1],[1,2],[1,3]]],
            [[[1,0],[1,1],[0,0],[0,1]],[[1,0],[1,1],[0,0],[0,1]],[[1,0],[1,1],[0,0],[0,1]],[[1,0],[1,1],[0,0],[0,1]]],
            [[[-1,0],[0,0],[0,1],[1,0]],[[0,0],[0,1],[0,-1],[1,0]],[[-1,0],[0,0],[0,-1],[1,0]],[[-1,0],[0,1],[0,0],[0,-1]]],
            [[[-1,1],[0,1],[1,1],[1,2]],[[0,2],[0,1],[0,0],[1,0]],[[-1,1],[0,1],[1,1],[-1,0]],[[0,2],[0,1],[0,0],[-1,2]]],
            [[[-1,1],[0,1],[1,1],[-1,2]],[[0,2],[0,1],[0,0],[1,2]],[[-1,1],[0,1],[1,1],[1,0]],[[0,2],[0,1],[0,0],[-1,0]]],
            [[[-1,0],[0,1],[0,0],[1,1]],[[0,1],[0,0],[1,0],[1,-1]],[[-1,-1],[0,-1],[0,0],[1,0]],[[-1,1],[-1,0],[0,0],[0,-1]]],
            [[[-1,1],[0,1],[0,0],[1,0]],[[1,1],[1,0],[0,0],[0,-1]],[[-1,0],[0,0],[0,-1],[1,-1]],[[-1,-1],[-1,0],[0,0],[0,1]]]
        ];
        this.colors = ["01EDFA", "FEFB34", "DD0AB2", "FF6F00", "2B35AF", "66FF01", "EE4B2B"]

    }
    checkcollision(x, y, rotation) {
        for(let i = 0; i < 4; i++) {
            if (x+this.config[this.block][rotation][i][0] < 2 || x+this.config[this.block][rotation][i][0] >= 12 || y+this.config[this.block][rotation][i][1] < 0 || y+this.config[this.block][rotation][i][1] >= 22) {
                return false;
            }
            if(this.grid[x+this.config[this.block][rotation][i][0]][y+this.config[this.block][rotation][i][1]] != -1) {
                return false;
            }
        }
        return true;
    }
    clearlines() {
        for(let y = 2; y < 24; y++) {
            let fullLine = true;
            for(let x = 2; x < 12; x++) {
                if(this.grid[x][y] === -1) 
                    fullLine = false;
            }
            if(fullLine) {
                for(let i = 2; i < 12; i++) 
                    this.grid[i][y] = -1;
                
                for(let j = y+1; j < 20; j++) {
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
            this.grid[this.x+this.config[this.block][this.rotation][i][0]][this.y+this.config[this.block][this.rotation][i][1]] = this.block;
        }
        this.x = 6;
        this.y = 19;
        this.block = Math.floor(Math.random()*7);
        this.rotation = 0;
    }
    tick() {
        if(this.checkcollision(this.x, this.y-1, this.rotation)) {
            this.y--;
        } else {
            console.log("placed")
            this.placeblock();
            this.clearlines();
        }
    }
    moveleft() {
        if(this.checkcollision(this.x-1, this.y, this.rotation)) {
            this.x--;
        }
            
    }
    moveright() {
        if(this.checkcollision(this.x+1, this.y, this.rotation))
            this.x++;
    }
    movedown() {
        if(this.checkcollision(this.x, this.y-1, this.rotation))
            this.y--;
    }
    rotatecw() {
        let newRotation = (this.rotation+1)%4;
        if(this.checkcollision(this.x, this.y, newRotation)) {
            this.rotation = newRotation;
        }
    }
    rotateccw() {
        let newRotation = (this.rotation+3)%4;
        console.log("rotating")
        if(this.checkcollision(this.x, this.y, newRotation)) {
            this.rotation = newRotation;
        }
    }
}