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
  const [type, setType] = useState();                
  const [currentPage, setCurrentPage] = useState(1);  
  const filteredEvents = ((!type ? data?.events : data?.events) || [])
    .filter(
      // Rajout de la function filter, pour filtrer les événements en fonction du type sélectionné et de la date de l'événement
      (event) =>  // Si le type est sélectionné, seuls les événements de ce type sont affichés
        (type ? event.type === type : true) && new Date(event.date) < new Date()
      // Si event.type est égal à type, on affiche l'événement, sinon on affiche tous les événements et on filtre par date de l'événement, si la date de l'événement est inférieure à la date actuelle, on affiche l'événement sinon on ne l'affiche pas.
    )

    .filter((event, index) => {
      if (
        (currentPage - 1) * PER_PAGE <= index &&
        PER_PAGE * currentPage > index
      ) {
        return true;
      }
      return false;
    });
    


  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };
  const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;
  const typeList = new Set(data?.events.map((event) => event.type));
  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
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
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;