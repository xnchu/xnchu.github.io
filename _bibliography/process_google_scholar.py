# Importing necessary library
import re

# Read the content of the BibTeX file
bib_file_path = '/Users/xnchu/Dropbox/projects/xnchu.github.io/_bibliography/google_scholar_xnchu.bib'
with open(bib_file_path, 'r') as file:
    bib_content = file.read()

# Splitting the BibTeX file into separate entries
bib_entries = re.split(r'\n(?=@)', bib_content)

# Extracting the year from each entry and sorting the entries by year
year_entry_pairs = []
for entry in bib_entries:
    match = re.search(r'year=\{(\d{4})\}', entry)
    if match:
        year = int(match.group(1))
        year_entry_pairs.append((year, entry))

sorted_entries = sorted(year_entry_pairs, key=lambda x: x[0], reverse=True)

# Filtering out entries that contain "Fall Meeting" in the booktitle
filtered_entries = [entry for entry in sorted_entries if ("fall meeting" not in entry[1].lower()) and  ("agu" not in entry[1].lower())]

# Saving the filtered entries into a new BibTeX file
new_bib_file_path = '/Users/xnchu/Dropbox/projects/xnchu.github.io/_bibliography/google_scholar_xnchu2.bib'
with open(new_bib_file_path, 'w') as file:
    for entry in filtered_entries:
        print(entry)
        file.write(entry[1] + "\n")
