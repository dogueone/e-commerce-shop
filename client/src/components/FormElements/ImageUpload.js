import React, { useState, useRef, useEffect } from "react";

import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [placeholder, setPlaceholder] = useState(false);

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

  const placeholderHandler = () => {
    const relevantPlaceholder = placeholder;
    let value;
    if (relevantPlaceholder === false) {
      value = "placeholder";
    } else {
      value = null;
    }
    setPlaceholder((prevState) => {
      return !prevState;
    });
    filePickerRef.current.value = "";
    setFile();
    setPreviewUrl();
    setIsValid(false);
    setImageError(false);
    console.log("placeholder is " + !relevantPlaceholder);
    console.log("value is " + value);
    props.onInput(props.id, value, !relevantPlaceholder);
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
      {!placeholder && (
        <div className={`image-upload ${props.center && "image-center"}`}>
          <div className="image-upload__preview">
            {previewUrl && <img src={previewUrl} alt="Preview" />}
            {/* {!isValid && !file && <p>{props.errorText}</p>} */}
          </div>
          <Button type="button" size="big" onClick={pickImageHandler}>
            Upload Image
          </Button>
        </div>
      )}
      <div style={{ display: "flex", marginTop: "1rem" }}>
        <input
          style={{ all: "revert", marginLeft: "0" }}
          name="placeholder"
          type="checkbox"
          onChange={placeholderHandler}
        />
        <label
          style={{
            all: "revert",
            color: "var(--light-purple-color)",
            fontWeight: "450",
            marginLeft: "4px",
          }}
          htmlFor="placeholder"
        >
          Use placeholder image
        </label>
      </div>

      {/* <Button type="button" size="big" onClick={pickImageUrlHandler}>
          Image URL
        </Button> */}

      {imageError && (
        <p className={"image-error"}>
          Image should be .jpg,.png,.jpeg, 500kb size max.
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
