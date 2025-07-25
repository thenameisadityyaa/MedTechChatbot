import os

dataset_path = "dataset"

try:
    files = os.listdir(dataset_path)
    print(f"Files in '{dataset_path}' folder:")
    for f in files:
        print(f"- {f}")
except FileNotFoundError:
    print(f"Folder '{dataset_path}' does not exist. Please check the folder name and path.")
