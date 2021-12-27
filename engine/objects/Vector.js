class Vector2D {
    /**
     * 
     * @param {Number} [x=0] - The x position of the vector
     * @param {Number} [y=0] - The y position of the vector
     */
    constructor(x,y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    /**
     * 
     * @param {Vector2D} vector 
     */
    addNew(vector) {
        let newVec = new Vector2D(this.x,this.y)
        newVec.add(vector)

        return newVec;
    }

    /**
     * 
     * @param {Vector2D} vector 
     */
     substractNew(vector) {
        let newVec = new Vector2D(this.x,this.y)
        newVec.substract(vector)

        return newVec;
    }

    /**
     * 
     * @param {Vector2D} vector 
     */
    add(vector) {
        this.x+=vector.x
        this.y+=vector.y

        return this;
    }

    /**
     * 
     * @param {Vector2D} vector 
     */
    substract(vector) {
        this.x-=vector.x
        this.y-=vector.y

        return this;
    }

    rotate(direction) {
        let oldX = this.x;
        this.x = this.x * Math.cos(direction) - this.y * Math.sin(direction);
        this.y = oldX * Math.sin(direction) + this.y * Math.cos(direction);
    }
 }