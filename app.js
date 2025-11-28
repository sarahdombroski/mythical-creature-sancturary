// Connect to Supabase
const client = supabase.createClient(
  "https://YOUR-PROJECT-LINK.supabase.co", //Replace with your supabase link, see the readme for more information on how to do that
  "YOUR-ANON-KEY-HERE" //Replace with your anon key, see the readme for more information on how to do that
);

let currentEditId = null;
let allCreatures = null;
const statuses = ["Contained", "Injured", "Escaped"]

// Fetch Data for displaying
async function loadCreatures() {
    const { data: creatures, error } = await client
        .from("creatures")
        .select("*")
        .order("id", {ascending: true}); 

    if (error) {
        console.error("SELECT ERROR:", error);
        return;
    }
    
    allCreatures = creatures;
    const creatureList = document.querySelector("#creaturesTable");
    creatureList.innerHTML = '';
    creatures.forEach(c => {
        const div = document.createElement("div");
        div.innerHTML = `
        <p><strong>${c.name}</strong> - ${c.species} | Danger Level: ${c.danger_level} | Status: ${c.status}</p>
        <button class="edit-btn" data-id="${c.id}">Edit</button>
        <button class="delete-btn" data-id="${c.id}">Delete</button>
        <hr />`;

        creatureList.appendChild(div);
    });
}

async function addCreature() {
    const name = document.getElementById('name');
    const species = document.getElementById('species');
    const danger = document.getElementById('danger');
    const elemental = document.getElementById('elemental');

    console.log("ABOUT TO INSERT:", {
        name: name.value,
        species: species.value,
        danger_level: Number(danger.value),
        elemental_type: elemental.value
    });

    const { error } = await client
        .from('creatures')
        .insert([{ name: name.value, species: species.value, danger_level: danger.value ? Number(danger.value) : null, elemental_type: elemental.value }]);
        
    if (error) {
        console.error("INSERT ERROR:", error);
        alert("Something went wrong adding your creature 😭");
    } else {
        console.log("Creature added!");
    }
    name.value = '';
    species.value = '';
    danger.value = '';
    elemental.value = '';
}

async function deleteCreature(creatureId) {
    const { data, error } = await client
        .from('creatures')
        .delete()
        .eq('id', creatureId)

    if (error) {
        console.error("DELETE ERROR:", error);
        alert("Could not delete creature 😭");
        return;
    }

    console.log("Deleted:", data);
    loadCreatures();
}

async function updateCreature(creatureId) {
    const name = document.getElementById('editName').value;
    const species = document.getElementById("editSpecies").value;
    const danger = Number(document.getElementById("editDanger").value) || null;
    const elemental = document.getElementById("editElemental").value;
    const status = document.getElementById('editStatus').value;

    const { data, error } = await client
        .from('creatures')
        .update({ name, species, danger_level: danger, elemental_type: elemental, status: status })
        .eq("id", creatureId);

    if (error) {
        console.error("UPDATE ERROR:", error);
        alert("Could not update creature 😭");
        return;
    }

    console.log("Updated", data);
    loadCreatures();
    const modalEl = document.getElementById('editModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
}

loadCreatures();
document.querySelector('#addCreatureButton').addEventListener('click', addCreature);

//init -> start with the form hidden
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#addNewCreature');
    form.classList.add('d-none');
})
// show form on button click
document.querySelector('#displayFormBtn').addEventListener("click", () => {
    const form = document.querySelector('#addNewCreature');
    form.classList.toggle('d-none');
})

// listen for edit and delete button
document.querySelector('#creaturesTable').addEventListener("click", async (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const creatureId = e.target.getAttribute('data-id');
        await deleteCreature(creatureId);
    }
    if (e.target.classList.contains('edit-btn')) {
        const creatureId = e.target.getAttribute('data-id');
        currentEditId = creatureId;
        
        const creature = allCreatures.find(c => c.id == creatureId);

        const statusSelect = document.getElementById("editStatus");
        statusSelect.innerHTML = "";
        statuses.forEach(s => {
            const option = document.createElement("option");
            option.value = s;
            option.textContent = s;
            if (creature.status === s) {
                option.selected = true;
            }
            statusSelect.appendChild(option);
        })

        document.getElementById('editName').value = creature.name;
        document.getElementById("editSpecies").value = creature.species;
        document.getElementById("editDanger").value = creature.danger_level;
        document.getElementById("editElemental").value = creature.elemental_type;
        document.getElementById("editStatus").value = creature.status;

        const editModal = new bootstrap.Modal(document.getElementById('editModal'));
        editModal.show();
    }
})

// save changes if updating
document.getElementById('saveEditBtn').addEventListener('click', () => {
    if (currentEditId) {
        updateCreature(currentEditId)
    } else {
        console.error("No creature was selected to update");
    }
})