import { Directive, HostListener, HostBinding } from "@angular/core";

@Directive({
    selector: "[appDropdown]",
    exportAs: "appDropDown"
})
export class DropdownDirective {
    private wasInside = false;

    @HostBinding("class.show") isOpen = false;

    @HostListener("click") toggleOpen() {
        this.isOpen = !this.isOpen;
        this.wasInside = true;
    }

    // https://stackoverflow.com/a/46656671
    @HostListener("document:click") clickout() {
        if (!this.wasInside) {
            this.isOpen = false;
        }
        this.wasInside = false;
    }
}
