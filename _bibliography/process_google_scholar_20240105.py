import re
import os

# Reading the original BibTex file
bib_file_path = '/Users/xnchu/Dropbox/projects/xnchu.github.io/_bibliography/google_scholar_xnchu_20240105.bib'
with open(bib_file_path, 'r') as file:
    bibtex_content = file.read()

# Extracting entries
entries = re.findall(r'@(.*?){(.*?)\n}', bibtex_content, re.DOTALL)

# Get the list of files in the "dir_preview" folder
dir_preview = '/Users/xnchu/Dropbox/projects/xnchu.github.io/assets/img/publication_preview/'
files_preview = os.listdir(dir_preview)

# Modifying entries
modified_entries = []
for entry_type, entry_content in entries:
    
    # Replace 'journaltitle' with 'journal'
    entry_content = entry_content.replace('journaltitle', 'journal')
    # Replace 'note' with 'papernote'
    entry_content = entry_content.replace('note', 'papernote')    
    # Replace 'url' with 'html'
    entry_content = entry_content.replace('url', 'html')
    # Remove 'rights' field
    entry_content = re.sub(r'\n\trights = \{.*?\},', '', entry_content)

    # Extract year from date and add it as a new 'year' field
    date_match = re.search(r'\bdate = \{(\d{4})', entry_content)
    if date_match:
        year = date_match.group(1)
        entry_content += f'\n\tyear = {{{year}}},'

    # Extract the entry key
    entry_key = re.search(r'^(.*?),', entry_content, re.MULTILINE).group(1)
    
    # find the files in preview folder dir_preview that has the name of entry_key
    
    # Filter the files that have the same name as the "entry_key"
    matching_files = [file for file in files_preview if file.startswith(entry_key)]
    # if matching_files is a list, use the first element
    if isinstance(matching_files, list):
        if matching_files:
            matching_files = matching_files[0]
            # Add 'preview' field equal to the entry key
            entry_content += f'\n\tpreview = {{{matching_files}}},'

    modified_entries.append((entry_type, entry_content))

# Saving modified entries to a new file
processed_file_path = '/Users/xnchu/Dropbox/projects/xnchu.github.io/_bibliography/google_scholar_xnchu_20240105_processed.bib'

with open(processed_file_path, 'w') as processed_file:
    for entry_type, entry_content in modified_entries:
        processed_file.write(f"@{entry_type}{{{entry_content}\n}}\n\n")

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

with open(processed_file_path, 'r+') as file:
    existing_content = file.read()
    file.seek(0, 0)
    file.write(additional_text.strip() + '\n\n\n\n' + existing_content)
