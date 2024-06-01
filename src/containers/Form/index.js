import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () => new Promise((resolve) => { setTimeout(resolve, 500); })

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();
      setSending(true);
      setErrorMessage(""); // Reset error message

      const formFields = evt.target.elements;
      let isAnyFieldEmpty = false;

      for (let i = 0; i < formFields.length; i += 1) {
        if (formFields[i].nodeName === "INPUT" || formFields[i].nodeName === "TEXTAREA") {
          if (!formFields[i].value.trim()) {
            isAnyFieldEmpty = true;
            break;
          }
        }
      }

      if (isAnyFieldEmpty) {
        setSending(false);
        setErrorMessage("Veuillez remplir tous les champs du formulaire");
        onError();
        return;
      }

      try {
        await mockContactApi();
        setSending(false);
        evt.target.reset();
        onSuccess(); // Appeler onSuccess lorsque l'envoi réussit
      } catch (err) {
        setSending(false);
        setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
        onError(err);
      }
    },
    [onSuccess, onError]
  );

  return (
    <form onSubmit={sendContact}>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="row">
        <div className="col">
          <Field placeholder="" label="Nom" />
          <Field placeholder="" label="Prénom" />
          <Select
            selection={["Personel", "Entreprise"]}
            onChange={() => null}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
          />
          <Field placeholder="" label="Email" />
          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
            {sending ? "En cours" : "Envoyer"}
          </Button>
        </div>
        <div className="col">
          <Field
            placeholder="message"
            label="Message"
            type={FIELD_TYPES.TEXTAREA}
          />
        </div>
      </div>
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
}

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
}

export default Form;
