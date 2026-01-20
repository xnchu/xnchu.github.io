import os
import re

# Reading the original BibTex file
# bib_file_path = "/Users/xnchu/Dropbox/projects/xnchu.github.io/_bibliography/google_scholar_xnchu_20240105.bib"
# bib_file_path = "/Users/xnchu/Dropbox/projects/xnchu.github.io/_bibliography/google_scholar_xnchu_20241229.bib"
bib_file_path = "/Users/xnchu/Dropbox/projects/xnchu.github.io/_bibliography/google_scholar_xnchu_20260119.bib"

# Saving modified entries to a new file
# processed_file_path = "/Users/xnchu/Dropbox/projects/xnchu.github.io/_bibliography/google_scholar_xnchu_20240105_processed.bib"
# processed_file_path = "/Users/xnchu/Dropbox/projects/xnchu.github.io/_bibliography/google_scholar_xnchu_20241229_processed.bib"
processed_file_path = "/Users/xnchu/Dropbox/projects/xnchu.github.io/_bibliography/google_scholar_xnchu_20260119_processed.bib"
processed_file_path2 = "/Users/xnchu/Dropbox/projects/xnchu.github.io/_bibliography/papers.bib"



with open(bib_file_path, "r") as file:
    bibtex_content = file.read()

# Extracting entries
entries = re.findall(r"@(.*?){(.*?)\n}", bibtex_content, re.DOTALL)

# Get the list of files in the "dir_preview" folder
dir_preview = "/Users/xnchu/Dropbox/projects/xnchu.github.io/assets/img/publication_preview/"
files_preview = os.listdir(dir_preview)

# Modifying entries
modified_entries = []
for entry_type, entry_content in entries:

    # Skip if the entry_type is 'techreport'
    if entry_type == "techreport":
        continue

    # Skip AGU Fall Meeting abstracts/entries
    booktitle_match = re.search(r"\bbooktitle\s*=\s*[{\"\']([^}\"\']+)[}\"\']", entry_content, re.IGNORECASE)
    journal_match = re.search(r"\bjournal\s*=\s*[{\"\']([^}\"\']+)[}\"\']", entry_content, re.IGNORECASE)
    
    skip_substrings = (
        "agu",
        "agu fall meeting",
        "agu25",
        "chapman conference",
        "ursi",
        "cospar",
        "preprint",
        "proposal",
        "workshop",
        "university of colorado", # Thesis
        "white paper", 
        "discussion",
        "conference",
        "tess",
    )

    def _should_skip_venue(value: str | None) -> bool:
        if not value:
            return False
        v = value.lower()
        return any(s in v for s in skip_substrings)

    # Skip if either booktitle OR journal matches any of the skip substrings.
    booktitle = booktitle_match.group(1) if booktitle_match else None
    journal = journal_match.group(1) if journal_match else None
    if _should_skip_venue(booktitle) or _should_skip_venue(journal):
        continue


    # Replace 'journaltitle' with 'journal'
    entry_content = entry_content.replace("journaltitle", "journal")
    # Replace 'note' with 'papernote'
    entry_content = entry_content.replace("note", "papernote")
    # Replace 'url' with 'html'
    entry_content = entry_content.replace("url", "html")
    # Remove 'rights' field
    entry_content = re.sub(r"\n\trights = \{.*?\},", "", entry_content)

    # Extract year from date and add it as a new 'year' field
    date_match = re.search(r"\bdate = \{(\d{4})", entry_content)
    if date_match:
        year = date_match.group(1)
        entry_content += f"\n\tyear = {{{year}}},"

    # Extract the entry key
    entry_key = re.search(r"^(.*?),", entry_content, re.MULTILINE).group(1)

    # Skip if the entry_key is "malaspina2022follow"
    if entry_key == "malaspina2022follow" or entry_key == "khoo2022understanding" or entry_key == "bortnik2019neural" or entry_key == "malaspina2018particle" or entry_key == "liu2013role" or entry_key == "cullencan" or entry_key == "babenkousnc" or entry_key == "connors2012comment":
        continue

    # find the files in preview folder dir_preview that has the name of entry_key

    # Filter the files that have the same name as the "entry_key"
    matching_files = [file for file in files_preview if file.startswith(entry_key)]
    # if matching_files is a list, use the first element
    if isinstance(matching_files, list):
        if matching_files:
            matching_files = matching_files[0]
            # Add 'preview' field equal to the entry key
            entry_content += f",\n\tpreview = {{{matching_files}}}"

    # For these entries, add the "selected" field
    if entry_key in ("chu2025imbalanced", "chu2024imbalanced", "chu2023distribution", "chu2019identifying"):
        entry_content += ",\n\tselected = {true},"

    modified_entries.append((entry_type, entry_content))


# Adding additional text to the beginning of the file
additional_text = """
# Journal title does not work. Use journal.
# Note are directly shown as text.
# 1. Change journaltitle to journal.
# 2. Remove note.
# 3. Add year.
# 4. Add preview of figure.
# 5. Change url to html.
# 6. Remove rights.

---
---

@string{aps = {American Physical Society,}}


"""

# Build the processed bib content once, then write the same combined content to both files.
processed_entries_text = "".join(
    f"@{entry_type}{{{entry_content}\n}}\n\n" for entry_type, entry_content in modified_entries
)
combined_text = additional_text.strip() + "\n\n\n\n" + processed_entries_text

for out_path in (processed_file_path, processed_file_path2):
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(combined_text)
    
print(f"Processed file saved to {processed_file_path}")
print(f"Processed file saved to {processed_file_path2}")
