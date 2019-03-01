import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FieldInfo, ColumnType } from '../field-info';
import { TableBaseFilter } from '../table.model';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'bp-filter-toolbar',
  templateUrl: './filter-toolbar.component.html',
  styleUrls: ['./filter-toolbar.component.scss']
})
export class FilterToolbarComponent implements OnInit {

  constructor() { }

  @Input()
  filter: TableBaseFilter;

  @Input()
  fields: Array<FieldInfo>;

  @Output()
  filterData: EventEmitter<any> = new EventEmitter();

  localFilter: TableBaseFilter;
  appliedFilters: Array<FieldInfo> = [];
  remainingFilters: Array<FieldInfo> = [];

  form = new FormGroup({});

  ngOnInit() {
    this.localFilter = { ...this.filter };
    this.remainingFilters = this.fields.reduce((acc: Array<FieldInfo>, current: FieldInfo) => {
      if (current.type === ColumnType.container) {
        return acc.concat(current.innerFields);
      }

      if (current.type !== ColumnType.dynamic) {
        return acc.concat(current);
      }

      return acc;
    }, []);
  }

  onFilter() {
    this.filterData.emit({
      ...this.localFilter,
      ...this.form.value
    });
  }

  addFilter(filter: FieldInfo) {
    this.appliedFilters.push(filter);

    this.form.addControl(filter.name, new FormControl());

    const index = this.remainingFilters.findIndex(f => f.name === filter.name);
    this.remainingFilters.splice(index, 1);
  }

  removeFilter(filter: FieldInfo) {
    const index = this.appliedFilters.findIndex(f => f.name === filter.name);
    this.appliedFilters.splice(index, 1);

    this.form.removeControl(filter.name);

    this.remainingFilters = this.fields.filter(f => !this.appliedFilters.find(e => e.name === f.name));
  }
}
