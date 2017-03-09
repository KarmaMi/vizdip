import * as UnitImageModule from "./standardMap/default/unit-image"
import * as BoardComponentModule from "./standardMap/default/board-component"

export namespace standardMap {
  export abstract class UnitImage<Power> extends UnitImageModule.UnitImage<Power> {}
  export class BoardComponent extends BoardComponentModule.BoardComponent {}
}
