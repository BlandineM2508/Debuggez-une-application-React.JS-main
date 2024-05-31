import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null); // Initialiser avec null pour tous les types
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrer les événements par type sélectionné
  let filteredEvents = data?.events || [];
  if (type) {
    filteredEvents = filteredEvents.filter((event) => event.type === type);
  }

  // Pagination : utiliser slice pour obtenir les événements de la page actuelle
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  // Changer le type et réinitialiser la page actuelle à 1
  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };

  // Calculer le nombre de pages
  const pageNumber = Math.ceil(filteredEvents.length / PER_PAGE);
  const typeList = new Set(data?.events.map((event) => event.type));

  return (
    <>
      {error && <div>An error occurred</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => changeType(value)}
          />
          <div id="events" className="ListContainer">
            {paginatedEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber)].map((_, index) => (
              <a key={index.id} href="#events" onClick={() => setCurrentPage(index + 1)}>
                {index + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
