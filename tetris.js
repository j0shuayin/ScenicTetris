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
        this.ghosty = 19;
        this.block = Math.floor(Math.random() * 7);
        this.rotation = 0;

        this.hold = -1;
        this.held = false;
        this.queue = [];

        let bag = []
        for (let i = 0; i < 7; i++) {
            if (i != this.block) bag.push(i);
        }
        for (let i = 6; i > 0; i--) {
            let x = Math.floor(Math.random() * i);
            let p = bag[x];
            this.queue.push(p);
            bag.splice(x, 1);
        }

        //order of pieces: IOTLJSZ
        this.config =  [
            [[[-1,1],[0,1],[1,1],[2,1]],[[1,2],[1,1],[1,0],[1,-1]],[[-1,0],[0,0],[1,0],[2,0]],[[0,2],[0,1],[0,0],[0,-1]]],
            [[[1,0],[1,1],[0,0],[0,1]],[[1,0],[1,1],[0,0],[0,1]],[[1,0],[1,1],[0,0],[0,1]],[[1,0],[1,1],[0,0],[0,1]]],
            [[[-1,0],[0,0],[0,1],[1,0]],[[0,0],[0,1],[0,-1],[1,0]],[[-1,0],[0,0],[0,-1],[1,0]],[[-1,0],[0,1],[0,0],[0,-1]]],
            [[[-1,1],[0,1],[1,1],[1,2]],[[0,2],[0,1],[0,0],[1,0]],[[-1,1],[0,1],[1,1],[-1,0]],[[0,2],[0,1],[0,0],[-1,2]]],
            [[[-1,1],[0,1],[1,1],[-1,2]],[[0,2],[0,1],[0,0],[1,2]],[[-1,1],[0,1],[1,1],[1,0]],[[0,2],[0,1],[0,0],[-1,0]]],
            [[[-1,0],[0,1],[0,0],[1,1]],[[0,1],[0,0],[1,0],[1,-1]],[[-1,-1],[0,-1],[0,0],[1,0]],[[-1,1],[-1,0],[0,0],[0,-1]]],
            [[[-1,1],[0,1],[0,0],[1,0]],[[1,1],[1,0],[0,0],[0,-1]],[[-1,0],[0,0],[0,-1],[1,-1]],[[-1,-1],[-1,0],[0,0],[0,1]]]
        ];
        this.colors = ["01EDFA", "FEFB34", "DD0AB2", "FF6F00", "2B35AF", "66FF01", "EE4B2B"]
        this.i_kick = [[[-2,0],[1,0],[-2,-1],[1,2]],
                       [[2,0],[-1,0],[2,1],[-1,-2]],
                       [[-1,0],[2,0],[-1,2],[2,-1]],
                       [[1,0],[-2,0],[1,-2],[-2,1]],
                       [[2,0],[-1,0],[2,1],[-1,-2]],
                       [[-2,0],[1,0],[-2,-1],[1,2]],
                       [[1,0],[-2,0],[1,-2],[-2,1]],
                       [[-1,0],[2,0],[-1,2],[2,-1]]]
        
        this.kick =   [[[-1,0],[-1,1],[0,-2],[-1,-2]],
                       [[1,0],[1,1],[0,2],[1,2]],
                       [[1,0],[1,-1],[0,2],[1,2]],
                       [[-1,0],[-1,1],[0,-2],[-1,-2]],
                       [[1,0],[1,1],[0,-2],[1,-2]],
                       [[-1,0],[-1,-1],[0,2],[-1,2]],
                       [[-1,0],[-1,-1],[0,2],[-1,2]],
                       [[1,0],[1,1],[0,-2],[1,-2]]]

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
        for(let y = 0; y < 24; y++) {
            var fullLine = true;
            for(let x = 2; x < 12; x++) {
                if(this.grid[x][y] == -1) 
                    fullLine = false;
            }
            if(fullLine == true) {
                for(let i = 2; i < 12; i++) 
                    this.grid[i][y] = -1;
                
                for(let j = y; j < 23; j++) {
                    for(let i = 2; i < 12; i++) {
                        this.grid[i][j] = this.grid[i][j+1];
                    }
                }
                for(let i = 2; i < 12; i++) 
                    this.grid[i][23] = -1;
                this.score++;
                y--;
            }
        }
    }
    getblock() {
        if (this.queue.length < 6) {
            this.bag = [0, 1, 2, 3, 4, 5, 6]
            for (let i = 7; i > 0; i--) {
                let x = Math.floor(Math.random() * i);
                let p = this.bag[x];
                this.queue.push(p);
                this.bag.splice(x, 1);
            }
        }
        let piece = this.queue[0];
        this.queue.splice(0, 1);
        return piece;
    }
    placeblock() {
        for(let i = 0; i < 4; i++) {
            this.grid[this.x+this.config[this.block][this.rotation][i][0]][this.y+this.config[this.block][this.rotation][i][1]] = this.block;
        }
        this.x = 6;
        this.y = 19;
        this.block = this.getblock();
        this.rotation = 0;
        this.held = false;
    }
    tick() {
        if(this.checkcollision(this.x, this.y-1, this.rotation)) {
            this.y--;
            return false;
        } else {
            this.placeblock();
            this.clearlines();
            return true;
        }
    }
    drop() {
        while(!this.tick()) {}
    }
    getGhosty() {
        for(let i = this.y; i >= 0; i--) {
            if(!this.checkcollision(this.x, i-1, this.rotation)) {
                return i;
            }
        }
        return -1;
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
    hold_piece() {
        if (this.held === true) return;
        if (this.hold === -1) {
            this.hold = this.block;
            this.block = this.getblock();
        }
        else {
            let temp = this.block;
            this.block = this.hold;
            this.hold = temp;
        }
        this.x = 6;
        this.y = 19;
        this.held = true;
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
        else {
            if (this.block === 1) return;

            let kicks = (this.block === 0) ? this.i_kick[this.rotation*2] : this.kick[this.rotation*2]
            for (let i = 0; i < 4; i++) {
                let nx = this.x + kicks[i][0];
                let ny = this.y + kicks[i][1];
                if (this.checkcollision(nx, ny, newRotation)) {
                    this.x = nx;
                    this.y = ny;
                    this.rotation = newRotation;
                    return;
                }
            }
        }
    }
    rotateccw() {
        let newRotation = (this.rotation+3)%4;
        if(this.checkcollision(this.x, this.y, newRotation)) {
            this.rotation = newRotation;
        }
        else {
            if (this.block === 1) return;

            let kicks = (this.block === 0) ? this.i_kick[(this.rotation*2+7)%8] : this.kick[(this.rotation*2+7)%8]
            for (let i = 0; i < 4; i++) {
                let nx = this.x + kicks[i][0];
                let ny = this.y + kicks[i][1];
                if (this.checkcollision(nx, ny, newRotation)) {
                    this.x = nx;
                    this.y = ny;
                    this.rotation = newRotation;
                    return;
                }
            }
        }
    }
}