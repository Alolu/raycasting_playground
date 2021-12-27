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
    add(vector) {
        this.x+=vector.x
        this.y+=vector.y

        return this;
    }
 }