// ---------------------------------------------------------------------
// PEOPLE & LOCATIONS
// ---------------------------------------------------------------------

import { allEvidence, allPeople, allLocations } from "../state.ts";
import type { Person } from "../types.ts";
import { evidenceMentionsPerson } from "../utils/lookup.ts";
import { getRequiredElement } from "../utils/dom.ts";
import { navigateTo } from "../navigation.ts";
import { renderEvidenceList, clearFilters } from "./evidence.ts";

export type PeopleTab = "people" | "locations";

export function switchPeopleTab(tab: PeopleTab): void {
  const peoplePanel = getRequiredElement("peoplePanel", HTMLElement);
  const locationsPanel = getRequiredElement("locationsPanel", HTMLElement);
  const peopleTabBtn = getRequiredElement("tabPeopleBtn", HTMLButtonElement);
  const locationsTabBtn = getRequiredElement("tabLocationsBtn", HTMLButtonElement);

  if (tab === "people") {
    peoplePanel.classList.remove("hidden");
    locationsPanel.classList.add("hidden");
    peopleTabBtn.classList.add("active");
    locationsTabBtn.classList.remove("active");
  } else {
    peoplePanel.classList.add("hidden");
    locationsPanel.classList.remove("hidden");
    peopleTabBtn.classList.remove("active");
    locationsTabBtn.classList.add("active");
  }
}

function countEvidenceForPerson(person: Person): number {
  return allEvidence.filter((ev) => evidenceMentionsPerson(ev, person)).length;
}

export function renderPeople(): void {
  const container = getRequiredElement("peoplePanel", HTMLElement);
  let html = "";
  for (const person of allPeople) {
    const count = countEvidenceForPerson(person);

    html += '<div class="person-card">';
    html += '<div class="person-card-header">';
    html += '<img class="person-avatar" src="' + person.avatar + '" alt="Portrait of ' + person.name + '">';
    html += "<div><h3>" + person.name + '</h3><div class="person-role">' + person.role + "</div></div>";
    html += "</div>";
    html += "<p><strong>Speciality:</strong> " + person.speciality + "</p>";
    html += "<ul>";
    for (const responsibility of person.responsibilities) {
      html += "<li>" + responsibility + "</li>";
    }
    html += "</ul>";
    html += '<div class="person-statement">&ldquo;' + person.statement + "&rdquo;</div>";
    html += "<p>" + count + " related evidence item" + (count === 1 ? "" : "s") + " &mdash; ";
    html += '<button type="button" class="evidence-count-link" data-person-id="' + person.id + '">view</button></p>';
    html += "</div>";
  }
  container.innerHTML = html;

  // The listener reads the id from its own button, not from event.target:
  // the target is whatever was clicked inside the button (Exercise 1, 5.1).
  container.querySelectorAll<HTMLButtonElement>(".evidence-count-link").forEach((link) => {
    link.addEventListener("click", () => {
      // the link promises exactly this person's items, so leftover filters must not apply
      clearFilters();
      getRequiredElement("filterPerson", HTMLSelectElement).value = link.dataset.personId ?? "";
      navigateTo("evidence");
      setTimeout(() => {
        renderEvidenceList();
      }, 0);
    });
  });
}

export function renderLocations(): void {
  const container = getRequiredElement("locationsPanel", HTMLElement);
  let html = "";
  for (const loc of allLocations) {
    html += '<div class="location-card">';
    html += "<h3>" + loc.id + " &mdash; " + loc.name + "</h3>";
    html += "<p>" + loc.description + "</p>";
    html += "<p><strong>Contains:</strong></p><ul>";
    for (const item of loc.contains) {
      html += "<li>" + item + "</li>";
    }
    html += "</ul></div>";
  }
  container.innerHTML = html;
}
