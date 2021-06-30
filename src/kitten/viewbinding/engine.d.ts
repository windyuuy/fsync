
declare namespace graphengine {

	export interface IDrawable {
		destroy(): void
		setColor(color: string): void
		setPos(x: number, y: number): void
	}

	export interface ISprite extends IDrawable {
		destroy()
		setColor(color: string): void
		setPos(x: number, y: number): void
		setSize(width: number, height: number)
		setRadius(radius: number)
	}

	export function createSprite(): ISprite
}
