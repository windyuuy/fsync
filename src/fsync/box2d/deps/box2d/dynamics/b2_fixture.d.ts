import { b2Vec2, b2Transform, XY } from "../common/b2_math.js";
import { b2AABB, b2RayCastInput, b2RayCastOutput } from "../collision/b2_collision.js";
import { b2TreeNode } from "../collision/b2_dynamic_tree.js";
import { b2Shape, b2ShapeType, b2MassData } from "../collision/b2_shape.js";
import { b2Body } from "./b2_body.js";
export interface b2IFilter {
    categoryBits: number;
    maskBits: number;
    groupIndex?: number;
}
export declare class b2Filter implements b2IFilter {
    static readonly DEFAULT: Readonly<b2Filter>;
    /**
    * 表示刚体的分组信息，但不决定要碰撞的分组对象。另外，值得注意的，这个值必须是2的N次方。当然设置成其他值，程序不会报错，但是实际的碰撞分类效果，可能会出现意想不到的差错。
    */
    categoryBits: number;
    /**
    * 表示刚体要碰撞的那个刚体分组对象。这个值通常是另外一个FilterData对象的categoryBits属性，表示只与该类刚体发生碰撞。如果要对多组刚体进行碰撞，可以设置maskBits为多个categoryBits的加合。如要和categoryBits分别为2和4的刚体组都进行碰撞，可以设置maskBits属性为6。
    */
    maskBits: number;
    /**
     * 表示刚体的分组信息。相同groupIndex属性的刚体属性一个组，groupIndex为正数时，刚体只和同组的刚体发生碰撞。groupIndex为负数时，刚体只和同组之外的刚体进行碰撞。
     * 当groupIndex==0时， 则启动categoryBits 和maskBits
     */
    groupIndex: number;
    Clone(): b2Filter;
    Copy(other: b2IFilter): this;
}
export interface b2IFixtureDef {
    shape: b2Shape;
    userData?: any;
    friction?: number;
    restitution?: number;
    density?: number;
    isSensor?: boolean;
    filter?: b2IFilter;
}
export declare class b2FixtureDef implements b2IFixtureDef {
    shape: b2Shape;
    userData: any;
    friction: number;
    restitution: number;
    density: number;
    isSensor: boolean;
    readonly filter: b2Filter;
}
export declare class b2FixtureProxy {
    readonly aabb: b2AABB;
    readonly fixture: b2Fixture;
    readonly childIndex: number;
    treeNode: b2TreeNode<b2FixtureProxy>;
    constructor(fixture: b2Fixture, childIndex: number);
    Reset(): void;
    Touch(): void;
    private static Synchronize_s_aabb1;
    private static Synchronize_s_aabb2;
    private static Synchronize_s_displacement;
    Synchronize(transform1: b2Transform, transform2: b2Transform): void;
}
export declare class b2Fixture {
    m_density: number;
    m_next: b2Fixture | null;
    readonly m_body: b2Body;
    readonly m_shape: b2Shape;
    m_friction: number;
    m_restitution: number;
    readonly m_proxies: b2FixtureProxy[];
    get m_proxyCount(): number;
    readonly m_filter: b2Filter;
    m_isSensor: boolean;
    m_userData: any;
    constructor(body: b2Body, def: b2IFixtureDef);
    Reset(): void;
    GetType(): b2ShapeType;
    GetShape(): b2Shape;
    SetSensor(sensor: boolean): void;
    IsSensor(): boolean;
    SetFilterData(filter: b2Filter): void;
    GetFilterData(): Readonly<b2Filter>;
    Refilter(): void;
    GetBody(): b2Body;
    GetNext(): b2Fixture | null;
    GetUserData<T>(): T;
    SetUserData(data: any): void;
    TestPoint(p: XY): boolean;
    ComputeDistance(p: b2Vec2, normal: b2Vec2, childIndex: number): number;
    RayCast(output: b2RayCastOutput, input: b2RayCastInput, childIndex: number): boolean;
    GetMassData(massData?: b2MassData): b2MassData;
    SetDensity(density: number): void;
    GetDensity(): number;
    GetFriction(): number;
    SetFriction(friction: number): void;
    GetRestitution(): number;
    SetRestitution(restitution: number): void;
    GetAABB(childIndex: number): Readonly<b2AABB>;
    Dump(log: (format: string, ...args: any[]) => void, bodyIndex: number): void;
    CreateProxies(): void;
    DestroyProxies(): void;
    TouchProxies(): void;
    SynchronizeProxies(transform1: b2Transform, transform2: b2Transform): void;
}
