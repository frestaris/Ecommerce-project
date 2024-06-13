import React from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { useSelector } from "react-redux";
import { Avatar, Badge } from "antd";

const FileUpload = ({ values, setValues, setLoading }) => {
  const user = useSelector((state) => state.user);

  const fileUploadAndResize = async (e) => {
    let files = e.target.files;
    let allUploadedFiles = [...values.images];

    if (files) {
      setLoading(true);
      for (let i = 0; i < files.length; i++) {
        try {
          const uri = await new Promise((resolve, reject) => {
            Resizer.imageFileResizer(
              files[i],
              720,
              720,
              "JPEG",
              100,
              0,
              (uri) => resolve(uri),
              "base64",
              720,
              720
            );
          });

          const res = await axios.post(
            `${process.env.REACT_APP_API}/uploadimages`,
            { image: uri },
            {
              headers: {
                authtoken: user ? user.token : "",
              },
            }
          );
          allUploadedFiles.push(res.data);
        } catch (error) {
          console.error(
            "Image upload failed",
            error.response ? error.response.data : error.message
          );
        }
      }

      setValues({ ...values, images: allUploadedFiles });
      setLoading(false);
    }
  };

  const handleImageRemove = (public_id) => {
    setLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API}/removeimage`,
        { public_id },
        {
          headers: {
            authtoken: user ? user.token : "",
          },
        }
      )
      .then((res) => {
        setLoading(false);
        const updatedImages = values.images.filter(
          (image) => image.public_id !== public_id
        );
        setValues({ ...values, images: updatedImages });
      })
      .catch((err) => {
        setLoading(false);
        console.error("Error removing image", err);
      });
  };

  return (
    <div>
      <div className="row">
        {values.images &&
          values.images.map((image) => (
            <span className="avatar-item col" key={image.public_id}>
              <Badge
                count="X"
                onClick={() => handleImageRemove(image.public_id)}
                style={{ cursor: "pointer" }}
              >
                <Avatar
                  src={image.url}
                  size={100}
                  shape="square"
                  className="ml-3 mb-2"
                />
              </Badge>
            </span>
          ))}
      </div>
      <div className="row">
        <label
          className="btn btn-outline-primary "
          style={{ display: "inline-block", width: "auto" }}
        >
          Choose File
          <input
            type="file"
            multiple
            hidden
            accept="images/*"
            onChange={fileUploadAndResize}
          />
        </label>
      </div>
    </div>
  );
};

export default FileUpload;
