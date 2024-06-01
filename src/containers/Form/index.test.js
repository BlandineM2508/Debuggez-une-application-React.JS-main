import { fireEvent, render, screen } from "@testing-library/react";
import Form from "./index";

describe("When Events is created", () => {  // quand un evenement est créé
  it("a list of event card is displayed", async () => {
// test et vérifie si les libellés ("Email", "Nom", "Prénom", "etc..") sont présents, indiquant que le formulaire est affiché correctement.
    render(<Form />);
    await screen.findByText("Email");
    await screen.findByText("Nom");
    await screen.findByText("Prénom");
    await screen.findByText("Personel / Entreprise");
  });

  describe("and a click is triggered on the submit button", () => {
// test le comportement du formulaire lors de la soumission.
    it("the success action is called", async () => {
      const onSuccess = jest.fn();  // on crée une fonction jest.fn pour simuler une action de succès 
      render(<Form onSuccess={onSuccess} />); // on simule un click sur le bouton submit
      fireEvent(
        await screen.findByTestId("button-test-id"),
        new MouseEvent("click", {
          cancelable: true,
          bubbles: true,
        })
      );
     


    });
  });
});