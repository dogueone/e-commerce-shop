import React, { useState, useRef, useEffect } from "react";

import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const filePickerRef = useRef([]);

  //to utilize element without seeing it
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      console.log(event.target.files);
      // console.dir(pickedFile);
      if (pickedFile.size > 500000) {
        console.log(pickedFile.size);
        setFile();
        setIsValid(false);
        setImageError(true);
        setPreviewUrl();
        props.onInput(props.id, null, false);
        return;
      }
      setFile(pickedFile);
      setIsValid(true);
      setImageError(false);
      fileIsValid = true;
      props.onInput(props.id, pickedFile, fileIsValid);
      return;
    } else if (!file) {
      console.log(event.target.files);
      // console.log("!file");
      setFile();
      setIsValid(false);
      setImageError(true);
      fileIsValid = false;
      props.onInput(props.id, null, false);
      return;
    }
    // console.log("Canceled");
    setFile();
    setIsValid(false);
    setPreviewUrl();
    props.onInput(props.id, null, false);
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        type="file"
        style={{ display: "none" }}
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "image-center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {/* {!isValid && !file && <p>{props.errorText}</p>} */}
        </div>
        <Button type="button" size="big" onClick={pickImageHandler}>
          Upload Image
        </Button>
        {/* <Button type="button" size="big" onClick={pickImageUrlHandler}>
          Image URL
        </Button> */}
      </div>

      {imageError && (
        <p className={"image-error"}>
          Image should be .jpg,.png,.jpeg, 500kb size max.
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
