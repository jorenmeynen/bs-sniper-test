import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { faInfoCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { finalize, pipe, SubscriptionLike } from 'rxjs';
import { Player } from 'src/app/classes/player';
import { PlayerSearch } from 'src/app/classes/PlayerSearch';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-add-profiles',
  templateUrl: './add-profiles.component.html',
  styleUrls: ['./add-profiles.component.scss']
})
export class AddProfilesComponent implements OnInit, OnDestroy {

  faIcons = {
    // info: faInfoCircle,
    plus: faPlus,
  }

  @Input() players: Player[] = [];
  @Output() playerAdded = new EventEmitter<Player>();

  selectedPlayerId: string;
  selectedPlayer: Player;
  searchedPlayers: Player[] = [];

  searches: string[] = [''];
  searchTerm: string;
  searchLoading: boolean = false;

  modalRef: NgbModalRef;
  searchPlayerSubscription: SubscriptionLike;

  constructor(
    private modalService: NgbModal,
    private playerService: PlayerService
  ) { }

  ngOnInit(): void {

  }
  ngOnDestroy(): void {
    this.searchPlayerSubscription?.unsubscribe();
  }

  search(search: { term: string; items: any[]; }) {
    this.searchLoading = false
    this.searchTerm = search.term;
    setTimeout(() => {
      if (
        this.searchTerm !== search.term
        // || this.searches.includes(this.searchTerm)
      ) return;

      console.log("called")

      this.searchPlayerSubscription?.unsubscribe();
      this.searchLoading = true;

      this.searchPlayerSubscription = this.playerService.getPlayers(this.searchTerm)
        .pipe(finalize(() => this.searchLoading = false))
        .subscribe({
          next: (data: any) => this.handleSearch(data),
          error: (error: any) => this.handleSearchError(error),
        });


    }, 500);
  }

  searchIdLoading: boolean = false;
  searchID(search: { term: string; items: any[];}) {
    console.log("searching for:", search);
    this.searchIdLoading = false
    this.searchTerm = search.term;
    setTimeout(() => {

      console.log("called")

      this.searchPlayerSubscription?.unsubscribe();
      this.searchIdLoading = true;

      this.searchPlayerSubscription = this.playerService.getProfile(this.searchTerm)
        .pipe(finalize(() => this.searchIdLoading = false))
        .subscribe({
          next: (data: any) => this.handleIdSearch(data),
          error: (error: any) => this.handleSearchError(error),
        });

    }, 500);

  }

  selectedPlayerById: string;
  searchedPlayerIds: Player[] = [];
  handleIdSearch(data: Player) {
    this.searchedPlayerIds = Object.assign([], [data]);
  }

  previousSearches: Player[] = [];
  handleSearch(data: PlayerSearch) {
    const ids = this.searchedPlayers.map(object => object['id']);
    this.previousSearches.push(...data.players.filter((e: any) => !ids.includes(e.id)))
    // this.searches.push(this.searchTerm)

    this.previousSearches.sort((a, b) => a.country > b.country ? 1 : -1)
    this.searchedPlayers = Object.assign([], this.previousSearches);

    console.log("completed:", data)
    // this.searchedPlayers = data.players;
  }

  handleSearchError(error: any) {
    console.log(error)
  }

  openModal(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  closeModal() {
    this.modalRef.close();
  }

  setSelectedPlayer() {
    this.selectedPlayer = this.searchedPlayers.find(e => e.id === this.selectedPlayerId);
  }

  setSelectedPlayerById() {
    this.selectedPlayer = this.searchedPlayerIds.find(e => e.id === this.selectedPlayerById);
  }

  addPlayer() {
    this.playerService.addPlayer(this.selectedPlayer);
    this.playerAdded.emit(this.selectedPlayer);
    this.selectedPlayer = null;
    this.selectedPlayerId = null;
    this.selectedPlayerById = null;
    this.closeModal();
  }

  uniqueBy = <T>(uniqueKey: keyof T, objects: T[]): T[] => {
    const ids = objects.map(object => object[uniqueKey]);
    return objects.filter((object, index) => !ids.includes(object[uniqueKey], index + 1));
  }

  groupByCountry(player: Player | any) {
    return player.country
  }

}
