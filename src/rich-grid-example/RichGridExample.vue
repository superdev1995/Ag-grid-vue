<template>
  <div>
    <div style="padding: 4px;">
      <div style="float: right;">
        <input
          @keyup="onQuickFilterChanged"
          type="text"
          id="quickFilterInput"
          placeholder="Type text to filter..."
        />
        <button :disabled="!showGrid" @click="showGrid=false">Destroy Grid</button>
        <button :disabled="showGrid" @click="showGrid=true">Create Grid</button>
      </div>
      <div>
        <b>Employees Skills and Contact Details</b>
        {{rowCount}}
      </div>
    </div>
    <div style="clear: both;"></div>
    <div v-if="showGrid">
      <div style="padding: 4px;" class="toolbar">
        <span>
          Grid API:
          <button @click="gridOptions.api.selectAll()">Select All</button>
          <button @click="gridOptions.api.deselectAll()">Clear Selection</button>
        </span>
        <span style="margin-left: 20px;">
          Column API:
          <button
            @click="gridOptions.columnApi.setColumnVisible('country', false)"
          >Hide Country Column</button>
          <button
            @click="gridOptions.columnApi.setColumnVisible('country', true)"
          >Show Country Column</button>
        </span>
      </div>
      <div style="clear: both;"></div>
      <div style="padding: 4px;" class="toolbar">
        <button @click="createRowData()">Refresh Data</button>
        <button
          v-on:click="toggleStatusBarComp()"
          style="margin-bottom: 10px"
        >Toggle Status Bar Component</button>
        <button @click="deleteSelected()">Delete</button>
        <button @click="jsonExport()">Export JSON format</button>
        <button @click="remoteDataFetch()">Get Remote Data</button>
      </div>
      <div style="padding: 4px;" class="toolbar">
        <button v-on:click="saveFilterModel()">Save Filter Model</button>
        <button v-on:click="restoreFilterModel()">Restore from Save</button>
        <button v-on:click="clearFilters()">Clear Filters</button>
      </div>
      <div>
        Saved Filters:
        <span id="savedFilters">[]</span>
      </div>
      <div style="clear: both;"></div>

      <ag-grid-vue
        style="height: 700px;"
        class="ag-theme-balham"
        :gridOptions="gridOptions"
        :columnDefs="columnDefs"
        :rowData="rowData"
        :frameworkComponents="frameworkComponents"
        :sideBar="sideBar"
        :defaultColDef="{
                            sortable: true,
                            resizable: true,
                            filter: true
                         }"
        :groupHeaders="true"
        :rowGroupPanelShow="rowGroupPanelShow"
        :statusBar="statusBar"
        :enableRangeSelection="true"
        :enableCharts="true"
        :icons="icons"
        :suppressDragLeaveHidesColumns="true"
        :suppressRowClickSelection="true"
        :colResizeDefault="colResizeDefault"
        :multiSortKey="multiSortKey"
        :animateRows="true"
        :groupSelectsChildren="true"
        :rowSelection="rowSelection"
        :localeText="localeText"
        :floatingFilter="true"
        :cacheQuickFilter="true"
        @grid-ready="onReady"
        @model-updated="onModelUpdated"
        @cell-clicked="onCellClicked"
        @cell-double-clicked="onCellDoubleClicked"
        @cell-context-menu="onCellContextMenu"
        @cell-value-changed="onCellValueChanged"
        @cell-focused="onCellFocused"
        @row-selected="onRowSelected"
        @selection-changed="onSelectionChanged"
        @filter-modified="onFilterModified"
        @virtual-row-removed="onVirtualRowRemoved"
        @row-clicked="onRowClicked"
        @column-everything-changed="onColumnEvent"
        @column-row-group-changed="onColumnEvent"
        @column-value-Changed="onColumnEvent"
        @column-moved="onColumnEvent"
        @column-visible="onColumnEvent"
        @column-group-Opened="onColumnEvent"
        @column-resized="onColumnEvent"
        @column-pinned-count-changed="onColumnEvent"
      ></ag-grid-vue>
    </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import "ag-grid-enterprise/chartsModule";
import "ag-grid-enterprise";

import { ProficiencyFilter } from "./proficiencyFilter";
import { SkillFilter } from "./skillFilter";
import DateComponent from "./DateComponent.vue";
import HeaderGroupComponent from "./HeaderGroupComponent.vue";
import RefData from "./refData";
import CustomStatsToolPanel from "./customToolPanel.js";
import CustomStatusBar from "./customStatusBar.js";

const selectData = [
  "Football",
  "Basketball",
  "Golf",
  "Pingpong",
  "Swimming",
  "Tenis"
];

export default {
  data() {
    return {
      gridOptions: null,
      columnDefs: null,
      rowData: null,
      showGrid: false,
      sideBar: true,
      rowCount: null,
      colResizeDefault: null,
      defaultColDef: null,
      multiSortKey: null,
      rowSelection: null,
      frameworkComponents: null,
      autoGroupColumnDef: null,
      rowGroupPanelShow: null,
      statusBar: null,
      localeText: null,
      statusOpen: true
    };
  },
  components: {
    AgGridVue
  },
  methods: {
    clearFilters() {
      this.gridOptions.api.setFilterModel(null);
      this.gridOptions.api.onFilterChanged();
    },
    saveFilterModel() {
      var savedFilters = "[]";
      window.savedModel = this.gridOptions.api.getFilterModel();
      if (window.savedModel) {
        savedFilters = Object.keys(window.savedModel);
      } else {
        savedFilters = "-none-";
      }
      document.querySelector("#savedFilters").innerHTML = JSON.stringify(
        savedFilters
      );
    },
    restoreFilterModel() {
      this.gridOptions.api.setFilterModel(window.savedModel);
      this.gridOptions.api.onFilterChanged();
    },
    remoteDataFetch() {
      const httpRequest = new XMLHttpRequest();
      const updateData = data => {
        this.rowData = data;
      };

      httpRequest.open(
        "GET",
        "https://api.jsonbin.io/b/5db7a6d4edb21d6c6e15c0d8"
      );
      httpRequest.setRequestHeader(
        "secret-key",
        "$2b$10$122jYLOSv67bdE9yJInKNO1vldFFBXeazp/cRL1nzpB4Hnv3t2OOW"
      );
      httpRequest.send();
      httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
          updateData(JSON.parse(httpRequest.responseText));
        }
      };
    },
    downloadObjectAsJson(exportObj, exportName) {
      var dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(exportObj));
      var downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", exportName + ".json");
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    },
    jsonExport() {
      this.downloadObjectAsJson(this.rowData, "jsonFormat.json");
    },
    toggleStatusBarComp() {
      if (this.statusOpen) {
        document.querySelector(".ag-status-bar").style = "display: none;";
        this.statusOpen = false;
      } else {
        this.statusOpen = true;
        document.querySelector(".ag-status-bar").style = "display: block;";
      }
    },
    createRowData() {
      const rowData = [];

      for (let i = 0; i < 200; i++) {
        const countryData = RefData.COUNTRIES[i % RefData.COUNTRIES.length];
        rowData.push({
          name:
            RefData.FIRST_NAMES[i % RefData.FIRST_NAMES.length] +
            " " +
            RefData.LAST_NAMES[i % RefData.LAST_NAMES.length],
          skills: {
            android: Math.random() < 0.4,
            html5: Math.random() < 0.4,
            mac: Math.random() < 0.4,
            windows: Math.random() < 0.4,
            css: Math.random() < 0.4
          },
          commit2017: Math.round(Math.random() * 100),
          commit2018: Math.round(Math.random() * 100),
          commit2019: Math.round(Math.random() * 100),
          favorite:
            selectData[Math.round(Math.random() * 100) % selectData.length],
          dob: RefData.DOBs[i % RefData.DOBs.length],
          address: RefData.ADDRESSES[i % RefData.ADDRESSES.length],
          years: Math.round(Math.random() * 100),
          proficiency: Math.round(Math.random() * 100),
          country: countryData.country,
          continent: countryData.continent,
          language: countryData.language,
          mobile: createRandomPhoneNumber(),
          landline: createRandomPhoneNumber()
        });
      }

      this.rowData = rowData;
    },
    createColumnDefs() {
      this.columnDefs = [
        {
          headerName: "Employee",
          headerGroupComponentFramework: HeaderGroupComponent,
          children: [
            {
              headerName: "Name",
              field: "name",
              headerCheckboxSelection: true,
              headerCheckboxSelectionFilteredOnly: true,
              checkboxSelection: true,
              width: 150,
              filter: "text",
              pinned: true
            },
            {
              headerName: "Country",
              field: "country",
              width: 150,
              cellRenderer: countryCellRenderer,
              pinned: true,
              enableRowGroup: true,
              filterParams: {
                cellRenderer: countryCellRenderer,
                cellHeight: 20
              },
              filter: "text"
            },
            {
              headerName: "DOB",
              field: "dob",
              width: 120,
              pinned: true,
              cellRenderer: params => {
                return (
                  this.pad(params.value.getDate(), 2) +
                  "/" +
                  this.pad(params.value.getMonth() + 1, 2) +
                  "/" +
                  params.value.getFullYear()
                );
              },
              columnGroupShow: "open"
            }
          ]
        },
        {
          headerName: "IT Skills",
          children: [
            {
              headerName: "Skills",
              width: 125,
              sortable: false,
              cellRenderer: skillsCellRenderer,
              filter: SkillFilter
            },
            {
              headerName: "Proficiency",
              field: "proficiency",
              width: 120,
              cellRenderer: percentCellRenderer,
              filter: ProficiencyFilter,
              aggFunc: "avg"
            }
          ]
        },
        {
          headerName: "Favorite Sports",
          children: [
            {
              headerName: "Favorite",
              field: "favorite",
              width: 125,
              editable: true,
              sortable: true,
              pivot: true,
              filter: "text",
              enablePivot: true,
              cellEditor: "agRichSelectCellEditor",
              cellEditorParams: {
                values: selectData
              }
            }
          ]
        },
        {
          headerName: "Commit Counts",
          children: [
            {
              headerName: "2017",
              field: "commit2017",
              width: 100,
              editable: true,
              sortable: true,
              filter: "text",
              enablePivot: true
            },
            {
              headerName: "2018",
              field: "commit2018",
              width: 100,
              editable: true,
              sortable: true,
              filter: "text",
              enablePivot: true
            },
            {
              headerName: "2019",
              field: "commit2019",
              width: 100,
              editable: true,
              sortable: true,
              filter: "text",
              enablePivot: true
            }
          ]
        },
        {
          headerName: "Contact",
          children: [
            {
              headerName: "Mobile",
              field: "mobile",
              width: 150,
              filter: "text"
            },
            {
              headerName: "Land-line",
              field: "landline",
              width: 150,
              filter: "text"
            },
            {
              headerName: "Address",
              field: "address",
              width: 500,
              filter: "text"
            }
          ]
        }
      ];
    },
    pad(num, totalStringSize) {
      let asString = num + "";
      while (asString.length < totalStringSize) asString = "0" + asString;
      return asString;
    },

    calculateRowCount() {
      if (this.gridOptions.api && this.rowData) {
        let model = this.gridOptions.api.getModel();
        let totalRows = this.rowData.length;
        let processedRows = model.getRowCount();
        this.rowCount =
          processedRows.toLocaleString() + " / " + totalRows.toLocaleString();
      }
    },

    onModelUpdated() {
      console.log("onModelUpdated");
      this.calculateRowCount();
    },

    onReady() {
      console.log("onReady");
      this.calculateRowCount();
    },

    onCellClicked(event) {
      console.log(
        "onCellClicked: " + event.rowIndex + " " + event.colDef.field
      );
    },

    onCellValueChanged(event) {
      console.log(
        "onCellValueChanged: " + event.oldValue + " to " + event.newValue
      );
    },

    onCellDoubleClicked(event) {
      console.log(
        "onCellDoubleClicked: " + event.rowIndex + " " + event.colDef.field
      );
    },

    onCellContextMenu(event) {
      console.log(
        "onCellContextMenu: " + event.rowIndex + " " + event.colDef.field
      );
    },

    onCellFocused(event) {
      console.log(
        "onCellFocused: (" + event.rowIndex + "," + event.colIndex + ")"
      );
    },

    // taking out, as when we 'select all', it prints to much to the console!!
    // eslint-disable-next-line
    onRowSelected(event) {
      // console.log('onRowSelected: ' + event.node.data.name);
    },

    onSelectionChanged() {
      console.log("selectionChanged");
      var selectedRows = this.gridOptions.api.getSelectedRows();
      var selectedRowsString = "";
      selectedRows.forEach(function(selectedRow, index) {
        if (index > 5) {
          return;
        }
        if (index !== 0) {
          selectedRowsString += ", ";
        }
        selectedRowsString += selectedRow.name;
      });
      if (selectedRows.length > 5) {
        selectedRowsString += " - and " + (selectedRows.length - 5) + " others";
      }
      document.querySelector("#selectedRows").innerHTML = selectedRowsString;
    },

    deleteSelected() {
      var selectedData = this.gridOptions.api.getSelectedRows();
      var res = this.gridOptions.api.updateRowData({ remove: selectedData });
      this.printResult(res);
    },

    printResult(res) {
      console.log("---------------------------------------");
      if (res.add) {
        res.add.forEach(function(rowNode) {
          console.log("Added Row Node", rowNode);
        });
      }
      if (res.remove) {
        res.remove.forEach(function(rowNode) {
          console.log("Removed Row Node", rowNode);
        });
      }
      if (res.update) {
        res.update.forEach(function(rowNode) {
          console.log("Updated Row Node", rowNode);
        });
      }
    },

    onFilterModified() {
      console.log("onFilterModified");
    },

    // eslint-disable-next-line
    onVirtualRowRemoved(event) {
      // because this event gets fired LOTS of times, we don't print it to the
      // console. if you want to see it, just uncomment out this line
      // console.log('onVirtualRowRemoved: ' + event.rowIndex);
    },

    onRowClicked(event) {
      console.log("onRowClicked: " + event.node.data.name);
    },

    onQuickFilterChanged(event) {
      this.gridOptions.api.setQuickFilter(event.target.value);
    },

    // here we use one generic event to handle all the column type events.
    // the method just prints the event name
    onColumnEvent(event) {
      console.log("onColumnEvent: " + event);
    }
  },
  beforeMount() {
    this.gridOptions = {};
    this.gridOptions.dateComponentFramework = DateComponent;
    this.createRowData();
    this.createColumnDefs();
    this.showGrid = true;
    this.defaultColDef = { resizable: true };
    this.colResizeDefault = "shift";
    this.multiSortKey = "ctrl";
    this.icons = {
      "custom-stats": '<span class="ag-icon ag-icon-custom-stats"></span>'
    };
    this.rowGroupPanelShow = "always";
    this.sideBar = {
      toolPanels: [
        {
          id: "columns",
          labelDefault: "Columns",
          labelKey: "columns",
          iconKey: "columns",
          toolPanel: "agColumnsToolPanel"
        },
        {
          id: "filters",
          labelDefault: "Filters",
          labelKey: "filters",
          iconKey: "filter",
          toolPanel: "agFiltersToolPanel"
        },
        {
          id: "customStats",
          labelDefault: "Custom Stats",
          labelKey: "customStats",
          iconKey: "custom-stats",
          toolPanel: "customStatsToolPanel"
        }
      ],
      defaultToolPanel: "customStats"
    };
    this.frameworkComponents = {
      customStatsToolPanel: CustomStatsToolPanel,
      customStatusBar: CustomStatusBar
    };
    this.rowSelection = "multiple";

    this.statusBar = {
      statusPanels: [
        {
          statusPanel: "agTotalAndFilteredRowCountComponent",
          align: "right"
        },
        { statusPanel: "customStatusBar", align: "left" }
      ]
    };
    this.localeText = {
      page: "daPage",
      more: "daMore",
      to: "daTo",
      of: "daOf",
      next: "daNexten",
      last: "daLasten",
      first: "daFirsten",
      previous: "daPreviousen",
      loadingOoo: "daLoading...",
      selectAll: "daSelect Allen",
      searchOoo: "daSearch...",
      blanks: "daBlanc",
      filterOoo: "daFilter...",
      applyFilter: "daApplyFilter...",
      equals: "daEquals",
      notEqual: "daNotEqual",
      lessThan: "daLessThan",
      greaterThan: "daGreaterThan",
      lessThanOrEqual: "daLessThanOrEqual",
      greaterThanOrEqual: "daGreaterThanOrEqual",
      inRange: "daInRange",
      contains: "daContains",
      notContains: "daNotContains",
      startsWith: "daStarts dawith",
      endsWith: "daEnds dawith",
      andCondition: "daAND",
      orCondition: "daOR",
      group: "laGroup",
      columns: "laColumns",
      filters: "laFilters",
      rowGroupColumns: "laPivot Cols",
      rowGroupColumnsEmptyMessage: "la drag cols to group",
      valueColumns: "laValue Cols",
      pivotMode: "laPivot-Mode",
      groups: "laGroups",
      values: "laValues",
      pivots: "laPivots",
      valueColumnsEmptyMessage: "la drag cols to aggregate",
      pivotColumnsEmptyMessage: "la drag here to pivot",
      toolPanelButton: "la tool panel",
      noRowsToShow: "la no rows",
      pinColumn: "laPin Column",
      valueAggregation: "laValue Agg",
      autosizeThiscolumn: "laAutosize Diz",
      autosizeAllColumns: "laAutsoie em All",
      groupBy: "laGroup by",
      ungroupBy: "laUnGroup by",
      resetColumns: "laReset Those Cols",
      expandAll: "laOpen-em-up",
      collapseAll: "laClose-em-up",
      toolPanel: "laTool Panelo",
      export: "laExporto",
      csvExport: "laCSV Exportp",
      excelExport: "laExcel Exporto (.xlsx)",
      excelXmlExport: "laExcel Exporto (.xml)",
      pivotChartAndPivotMode: "laPivot Chart & Pivot Mode",
      pivotChart: "laPivot Chart",
      chartRange: "laChart Range",
      columnChart: "laColumn",
      groupedColumn: "laGrouped",
      stackedColumn: "laStacked",
      normalizedColumn: "la100% Stacked",
      barChart: "laBar",
      groupedBar: "laGrouped",
      stackedBar: "laStacked",
      normalizedBar: "la100% Stacked",
      pieChart: "laPie",
      pie: "laPie",
      doughnut: "laDoughnut",
      line: "laLine",
      xyChart: "laX Y (Scatter)",
      scatter: "laScatter",
      bubble: "laBubble",
      areaChart: "laArea",
      area: "laArea",
      stackedArea: "laStacked",
      normalizedArea: "la100% Stacked",
      pinLeft: "laPin &lt;&lt;",
      pinRight: "laPin &gt;&gt;",
      noPin: "laDontPin &lt;&gt;",
      sum: "laSum",
      min: "laMin",
      max: "laMax",
      none: "laNone",
      count: "laCount",
      average: "laAverage",
      filteredRows: "laFiltered",
      selectedRows: "laSelected",
      totalRows: "laTotal Rows",
      totalAndFilteredRows: "laRows",
      copy: "laCopy",
      copyWithHeaders: "laCopy Wit hHeaders",
      ctrlC: "ctrl n C",
      paste: "laPaste",
      ctrlV: "ctrl n V",
      pivotChartTitle: "laPivot Chart",
      rangeChartTitle: "laRange Chart",
      settings: "laSettings",
      data: "laData",
      format: "laFormat",
      categories: "laCategories",
      series: "laSeries",
      axis: "laAxis",
      color: "laColor",
      thickness: "laThickness",
      xRotation: "laX Rotation",
      yRotation: "laY Rotation",
      ticks: "laTicks",
      width: "laWidth",
      length: "laLength",
      padding: "laPadding",
      chart: "laChart",
      title: "laTitle",
      font: "laFont",
      top: "laTop",
      right: "laRight",
      bottom: "laBottom",
      left: "laLeft",
      labels: "laLabels",
      size: "laSize",
      legend: "laLegend",
      position: "laPosition",
      markerSize: "laMarker Size",
      markerStroke: "laMarker Stroke",
      markerPadding: "laMarker Padding",
      itemPaddingX: "laItem Padding X",
      itemPaddingY: "laItem Padding Y",
      strokeWidth: "laStroke Width",
      offset: "laOffset",
      tooltips: "laTooltips",
      offsets: "laOffsets",
      callout: "laCallout",
      markers: "laMarkers",
      shadow: "laShadow",
      blur: "laBlur",
      xOffset: "laX Offset",
      yOffset: "laY Offset",
      lineWidth: "laLine Width",
      normal: "laNormal",
      bold: "laBold",
      italic: "laItalic",
      boldItalic: "laBold Italic",
      fillOpacity: "laFill Opacity",
      strokeOpacity: "laLine Opacity",
      columnGroup: "laColumn",
      barGroup: "laBar",
      pieGroup: "laPie",
      lineGroup: "laLine",
      scatterGroup: "laScatter",
      areaGroup: "laArea",
      groupedColumnTooltip: "laGrouped",
      stackedColumnTooltip: "laStacked",
      normalizedColumnTooltip: "la100% Stacked",
      groupedBarTooltip: "laGrouped",
      stackedBarTooltip: "laStacked",
      normalizedBarTooltip: "la100% Stacked",
      pieTooltip: "laPie",
      doughnutTooltip: "laDoughnut",
      lineTooltip: "laLine",
      groupedAreaTooltip: "laGrouped",
      stackedAreaTooltip: "laStacked",
      normalizedAreaTooltip: "la100% Stacked",
      scatterTooltip: "laScatter",
      bubbleTooltip: "laBubble",
      noDataToChart: "laNo data available to be charted.",
      pivotChartRequiresPivotMode: "laPivot Chart requires Pivot Mode enabled."
    };
  }
};

function skillsCellRenderer(params) {
  let data = params.data;
  let skills = [];
  RefData.IT_SKILLS.forEach(function(skill) {
    if (data && data.skills && data.skills[skill]) {
      skills.push(
        '<img src="https://raw.githubusercontent.com/ag-grid/ag-grid-docs/master/src/images/skills/' +
          skill +
          '.png" width="16px" title="' +
          skill +
          '" />'
      );
    }
  });
  return skills.join(" ");
}

function countryCellRenderer(params) {
  let flag =
    "<img border='0' width='15' height='10' style='margin-bottom: 2px' src='https://raw.githubusercontent.com/ag-grid/ag-grid-docs/master/src/images/flags/" +
    RefData.COUNTRY_CODES[params.value] +
    ".png'>";
  return flag + " " + params.value;
}

function createRandomPhoneNumber() {
  let result = "+";
  for (let i = 0; i < 12; i++) {
    result += Math.round(Math.random() * 10);
    if (i === 2 || i === 5 || i === 8) {
      result += " ";
    }
  }
  return result;
}

function percentCellRenderer(params) {
  // Render proficient value as colored bar
  let value = params.value;

  let eDivPercentBar = document.createElement("div");
  eDivPercentBar.className = "div-percent-bar";
  eDivPercentBar.style.width = value + "%";
  if (value < 20) {
    eDivPercentBar.style.backgroundColor = "red";
  } else if (value < 60) {
    eDivPercentBar.style.backgroundColor = "#ff9900";
  } else {
    eDivPercentBar.style.backgroundColor = "#00A000";
  }

  let eValue = document.createElement("div");
  eValue.className = "div-percent-value";
  eValue.innerHTML = value + "%";

  let eOuterDiv = document.createElement("div");
  eOuterDiv.className = "div-outer-div";
  eOuterDiv.appendChild(eValue);
  eOuterDiv.appendChild(eDivPercentBar);

  return eOuterDiv;
}
</script>

<style>
.ag-cell {
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}

label {
  font-weight: normal !important;
}

.div-percent-bar {
  display: inline-block;
  height: 100%;
  position: relative;
  z-index: 0;
}

.div-percent-value {
  position: absolute;
  padding-left: 4px;
  font-weight: bold;
  font-size: 13px;
  z-index: 100;
}

.div-outer-div {
  display: inline-block;
  height: 100%;
  width: 100%;
}

.ag-menu {
  z-index: 200;
}

.toolbar button {
  margin-left: 5px;
  margin-right: 5px;
  padding: 2px;
}
</style>
