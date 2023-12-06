import { useState } from "react";
import { Col, Container, Navbar, Row } from "react-bootstrap";

import { Sort } from "./Sort";
import { SearchBar } from "./SearchBar";
import { ArrangementsTable } from "./ArrangementsTable";
import { ChosenArrangementsTable } from "./ChosenArrangementsTable";
import { PDFGenerator } from "./PdfGenerator";
import { sortByColumn } from "./helper/sorter";
import { SongBar } from "./SongBar";

import type { PlayingSong, SongArrangement } from "../types";

import "bootstrap/dist/css/bootstrap.css";
import "../css/App.css";

function App() {
  const [results, setResults] = useState<SongArrangement[]>([]);
  const [selectedResults, setSelectedResults] = useState<SongArrangement[]>([]);
  const [playingSong, setPlayingSong] = useState<PlayingSong>({
    songName: "",
    arrangementName: "",
    partName: "",
  });

  const handleSelectSong = (
    songArrangement: SongArrangement,
    checked: boolean
  ) => {
    checked
      ? handleAddSong(songArrangement)
      : handleRemoveSong(songArrangement);
  };

  const clearSelected = () => {
    setSelectedResults([]);
  };

  const handleAddSong = (songArrangement: SongArrangement) => {
    setSelectedResults([...selectedResults, songArrangement]);
    const updatedRes = results.filter(
      (r) => r.arrangement.id !== songArrangement.arrangement.id
    );

    setResults(updatedRes);
  };

  const handleRemoveSong = (songArrangement: SongArrangement) => {
    const updatedRes = selectedResults.filter(
      (r) => r.arrangement.id !== songArrangement.arrangement.id
    );
    setResults([songArrangement, ...results]);
    setSelectedResults(updatedRes);
  };

  const handleSelectedResultsSortBy = (column: string, direction: string) => {
    const sorted = sortByColumn(selectedResults, column, direction);
    setSelectedResults(sorted.slice());
  };

  const handleResultsSortBy = (column: string, direction: string) => {
    const sorted = sortByColumn(results, column, direction);
    setResults(sorted.slice());
  };

  return (
    <>
      <Navbar
        expand="lg"
        className="bg-body-tertiary"
        bg="dark"
        data-bs-theme="dark"
      >
        <Container fluid="md">
          <Navbar.Brand className="nav-bar-title" href="#">
            Cadern.in
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Container fluid="md">
        <Row>
          <Col xs={12} sm={6}>
            <SearchBar handleResults={setResults} />
          </Col>
          <Col xs={12} sm={6}>
            <PDFGenerator songArrangements={selectedResults} />
          </Col>
        </Row>
        <SongBar info={playingSong} />
        <Row className="mt-4">
          <Col xs={12} sm={6}>
            {results.length > 0 && (
              <>
                <h3 className="results">Resultados</h3>
                <Row>
                  <Col sm="4">
                    <Sort onSortBy={handleResultsSortBy} />
                  </Col>
                </Row>
                <ArrangementsTable
                  songArrangements={results}
                  handlePlayingSong={setPlayingSong}
                  handleSelect={handleSelectSong}
                />
              </>
            )}
          </Col>
          <Col xs={12} sm={6}>
            {(selectedResults.length > 0 || results.length > 0) && (
              <>
                <h3 className="results">Resultados selecionados</h3>
                <Row>
                  <Col sm="4">
                    <Sort onSortBy={handleSelectedResultsSortBy} />
                  </Col>
                </Row>
                <ChosenArrangementsTable
                  songArrangements={selectedResults}
                  handlePlayingSong={setPlayingSong}
                  handleSelect={handleSelectSong}
                  handleClear={clearSelected}
                />
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
