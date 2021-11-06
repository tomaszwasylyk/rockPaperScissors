import { epsilon } from './constants'

export default class vec3 {

    get x(): number {
        return this.values[0]
    }

    get y(): number {
        return this.values[1]
    }

    get z(): number {
        return this.values[2]
    }

    get xy(): [number, number] {
        return [
            this.values[0],
            this.values[1],
        ]
    }

    get xyz(): [number, number, number] {
        return [
            this.values[0],
            this.values[1],
            this.values[2],
        ]
    }

    set x(value: number) {
        this.values[0] = value
    }

    set y(value: number) {
        this.values[1] = value
    }

    set z(value: number) {
        this.values[2] = value
    }

    set xy(values: [number, number]) {
        this.values[0] = values[0]
        this.values[1] = values[1]
    }

    set xyz(values: [number, number, number]) {
        this.values[0] = values[0]
        this.values[1] = values[1]
        this.values[2] = values[2]
    }

    constructor(values?: [number, number, number]) {
        if (values !== undefined) {
            this.xyz = values
        }
    }

    private values = new Float32Array(3)

    static readonly zero = new vec3([0, 0, 0])
    static readonly one = new vec3([1, 1, 1])

    static readonly up = new vec3([0, 1, 0])
    static readonly right = new vec3([1, 0, 0])
    static readonly forward = new vec3([0, 0, 1])

    at(index: number): number {
        return this.values[index]
    }

    copy(dest?: vec3): vec3 {
        if (!dest) { dest = new vec3() }

        dest.x = this.x
        dest.y = this.y
        dest.z = this.z

        return dest
    }



    equals(vector: vec3, threshold = epsilon): boolean {
        if (Math.abs(this.x - vector.x) > threshold) {
            return false
        }

        if (Math.abs(this.y - vector.y) > threshold) {
            return false
        }

        if (Math.abs(this.z - vector.z) > threshold) {
            return false
        }

        return true
    }

    length(): number {
        return Math.sqrt(this.squaredLength())
    }

    squaredLength(): number {
        const x = this.x
        const y = this.y
        const z = this.z

        return (x * x + y * y + z * z)
    }

    add(vector: vec3): vec3 {
        return new vec3([this.x + vector.x, this.y + vector.y, this.z + vector.z])
    }

    subtract(vector: vec3): vec3 {
        return new vec3([this.x - vector.x, this.y - vector.y, this.z - vector.z])
    }
 
    scale(value: number): vec3 {
        return new vec3([this.x * value, this.y * value, this.z * value])
    }




}