class Vector3 {
    /**
     * 
     * @param {Number} [x=0] - The x position of the vector
     * @param {Number} [y=0] - The y position of the vector
     */
    constructor(x,y,z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    /**
     * 
     * @param {Vector3} vector 
     */
    addNew(vector) {
        let newVec = new Vector3(this.x,this.y,this.z)
        newVec.add(vector)

        return newVec;
    }

    /**
     * 
     * @param {Vector3} vector 
     */
     substractNew(vector) {
        let newVec = new Vector3(this.x,this.y,this.z)
        newVec.substract(vector)

        return newVec;
    }

    /**
     * 
     * @param {Vector3} vector 
     */
    add(vector) {
        this.x+=vector.x
        this.y+=vector.y
        this.z+=vector.z

        return this;
    }

    /**
     * 
     * @param {Vector3} vector 
     */
    substract(vector) {
        this.x-=vector.x
        this.y-=vector.y
        this.z-=vector.z

        return this;
    }

    rotate(direction) {

        direction = direction * (Math.PI/180)

        let oldX = this.x;
        this.x = this.x * Math.cos(direction) - this.y * Math.sin(direction);
        this.y = oldX * Math.sin(direction) + this.y * Math.cos(direction);

        return this;
    }

    multiplyNew(factor) {
        let newVec = new Vector3(this.x,this.y,this.z)
        newVec.multiply(factor)
        
        return newVec;
    }

    multiply(factor){
        this.x = this.x * factor
        this.y = this.y * factor
        this.z = this.z * factor

        return this
    }

    clone(){
        return new Vector3(this.x,this.y,this.z)
    }

    set(x,y,z){
        this.x = x || this.x;
        this.y = y || this.y;
        this.z = z || this.z;

        return this;
    }

    toInt(){
        this.x = Math.floor(this.x)
        this.y = Math.floor(this.y)
        this.z = Math.floor(this.z)

        return this;
    }

    toString(){
        return `x:${this.x}, y:${this.y}, z:${this.z}`
    }

    /**
     * 
     * @param {Vector3} vector 
     */
    equals(vector){
        return this.x == vector.x && this.y == vector.y && this.z == vector.z
    }
}

function includesVector(vecArr,vector){
    for (let vec of vecArr){
        if(vec.equals(vector)) return true   
    }
    return false
}