import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ColDef, ColGroupDef, GridOptions} from 'ag-grid-community';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'assessment';
  phoneNumberForm: FormGroup;
  private gridApi;
  phoneNumberGridOptions: GridOptions = this.initializeGridOptions();
  public overlayNoRowsTemplate;
  phoneNumberDefs = [
    { headerName: 'Phone Number', field: 'phoneNumber', filter: 'agTextColumnFilter', sortable: true },
  ];
  combinations = {
    2: ['a', 'b', 'c'],
    3: ['d', 'e', 'f'],
    4: ['g', 'h', 'i'],
    5: ['j', 'k', 'l'],
    6: ['m', 'n', 'o'],
    7: ['p', 'q', 'r', 's'],
    8: ['t', 'u', 'v'],
    9: ['w', 'x', 'y', 'z']
  };

  phoneNumberCombinations: [];

  constructor(private fb: FormBuilder) {
    this.overlayNoRowsTemplate = '<span>Please wait while data is loading.</span>';
  }
  ngOnInit(): void {
  this.initializeForm();
  }
  initializeForm() {
    this.phoneNumberForm = this.fb.group({
      phoneNumber: new FormControl(null, [Validators.required, this.ValidatePhone]),
    });
  }
  /**
   * initializing the grid
   */
  private initializeGridOptions() {
    return {
      rowSelection: 'single',
      defaultColDef: {
        sortable: true,
        resizable: true,
        filter: 'agTextColumnFilter',
        filterParams: {
          suppressAndOrCondition: true
        }
      },
      headerHeight: 50,
      pagination: true,
      paginationPageSize: 25,
      cacheBlockSize: 25,
      domLayout: 'autoHeight',
      rowData: this.phoneNumberCombinations,
      onGridReady: params => {
        this.gridApi = params.api;
        params.api.sizeColumnsToFit();
        // this.gridApi.setDatasource(this.hhgRateQueryResults);
        window.addEventListener('resize', () => {
          setTimeout(() => {
            params.api.sizeColumnsToFit();
          });
        });
      },
      overlayLoadingTemplate:
        '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>'
    } as GridOptions;
  }

  generate() {
    let tempArray = [];
    const phoneNumber = this.phoneNumberForm.get('phoneNumber').value;
    const combinedResults = [];
    for (let i = 0; i < phoneNumber.length; i++) {
        const phoneNumberDigit = phoneNumber[i];
        if (phoneNumberDigit !== '0' && phoneNumberDigit !== '1') {
          const correspondingLetter = this.combinations[phoneNumberDigit];
          for (let j = 0; j < correspondingLetter.length; j++) {
            const letter = correspondingLetter[j];
            tempArray.push(phoneNumber.substr(0, i) + letter + phoneNumber.substr(i + 1));
          }
        }
      }
    console.log(tempArray);
    this.gridApi.setRowData(tempArray);
    }
   ValidatePhone(control: AbstractControl): {[key: string]: any} | null  {
    if (control.value && control.value.length !== 10  && control.value.length !== 7) {
      return { phoneNumberInvalid: true };
    }
    return null;
  }
}
