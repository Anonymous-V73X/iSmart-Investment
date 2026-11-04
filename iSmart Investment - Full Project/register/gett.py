
#! import requests                        

# URL of the trans.json file on the remote server
#* remote_url = 'https://alekie254.000webhostapp.com/trans.json'

# Path where you want to save the file on your local machine
#! local_file_path = 'trans.json'                                     

#! try:
    # Send a GET request to the remote URL
    #! response = requests.get(remote_url)
    
    # Raise an exception if the request was unsuccessful
    #! response.raise_for_status()

    # Write the content of the response to a local file
    #* with open(local_file_path, 'wb') as file:
        #! file.write(response.content)
    
    #! print(f'File downloaded and saved to {local_file_path} successfully.')

#! except requests.exceptions.RequestException as e:
    #! print(f'Error: {e}')
