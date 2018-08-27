import { Component, OnInit } from '@angular/core';
import { RankingService } from '../ranking.service';
import { RankData } from '../rankdata'

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  rankingData: any = [];
  sampleRankingData: any = [];
  nodeFound: boolean = false;

  dataName: string;
  parentId: number;

  dataNameUpdate: string;
  nodeId: number;

  dataNameSearch: string;
  dataSearchResult: any;

  statusMessage: string = "";

  constructor(private rankingService: RankingService) { }

  ngOnInit() {
    this.getRankingData();
  }

  public getRankingData(): void {
    this.rankingData = this.rankingService.getRankingData();
    this.sampleRankingData = this.rankingService.getRankingData();
  }

  public findRankingByParentIdAndAdd(idOfNode: number, parentId: number, dataName: string, rankingD: any) {
    if (!this.nodeFound) {
      for(let rd of rankingD) {
          if(rd.Id == parentId) {
            if (rd.Nodes == null) {
              rd.Nodes = [];
            }
            rd.Nodes.push({
               Id: idOfNode, Name: dataName, Nodes: null
            })
            this.nodeFound = true;
            return;
          } else {
            if (rd.Nodes != null){
              this.findRankingByParentIdAndAdd(idOfNode, parentId, dataName, rd.Nodes);
            }
          }
      }
    } else {
      return;
    }
  }

  public findRankingByParentIdAndUpdate(nodeId: number, dataName: string, rankingD: any) {
    if (!this.nodeFound) {
      for(let rd of rankingD) {
          if(rd.Id == nodeId) {
            rd.Name = dataName;
            this.nodeFound = true;
            return;
          } else {
            if (rd.Nodes != null){
              this.findRankingByParentIdAndUpdate(nodeId, dataName, rd.Nodes);
            }
          }
      }
    } else {
      return;
    }
  }

  public findRankingByName(dataName: string, rankingD: any) {
    if (!this.nodeFound) {
      for(let rd of rankingD) {
          if(rd.Name.toLowerCase() == dataName.toLowerCase()) {
            this.nodeFound = true;
            this.dataSearchResult = [rd];
          } else {
            if (rd.Nodes != null){
              this.findRankingByName(dataName, rd.Nodes);
            }
          }
      }
    }
  }

  public addDatainRankingData(): void {
    this.nodeFound = false;
    this.findRankingByParentIdAndAdd(this.parentId+100, this.parentId, this.dataName, this.rankingData);
    if(this.nodeFound) {
      this.statusMessage = "Node added successfully.";
    } else {
      this.statusMessage = "Node not found.";
    }
  }

  public updateDatainRankingData(): void {
    this.nodeFound = false;
    this.findRankingByParentIdAndUpdate(this.nodeId, this.dataNameUpdate, this.rankingData);
    if(this.nodeFound) {
      this.statusMessage = "Node updated successfully.";
    } else {
      this.statusMessage = "Node not found.";
    }
  }

  public searchDatainRankingData(): void {
    this.getRankingData();
    this.nodeFound = false;
    this.findRankingByName(this.dataNameSearch, this.rankingData);
    if(this.nodeFound) {
      this.rankingData = this.dataSearchResult;
      this.statusMessage = "Node found with name " + this.dataNameSearch + ": " + JSON.stringify(this.dataSearchResult);
    } else {
      if(this.dataNameSearch == "") {
        this.getRankingData();
        this.statusMessage = "";
      } else {
        this.rankingData = [];
        this.statusMessage = "Node not found with name: " + this.dataNameSearch;
      }

    }
  }
}
