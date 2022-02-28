import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Pagination from "@mui/material/Pagination";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import * as React from "react";

const theme = createTheme();

// Нужно создать приложение на React. Можно использовать разные шаблоны (Material UI).
// Что нужно сделать:
// - Создать приложение, где нужно вывести через Rest API данные (можно плиткам) (Ссылка на данные - http://jsonplaceholder.typicode.com/photos);
// - Сделать постраничный вывод картинок;
// - Сделать кнопку удаления картинки;
// - При нажатии выводить модалку с увеличенной картинок (для списка - thumbnailUrl, для модалки - url);
// - Сделать возможность сортировки по айдишнику альбома (albumId), сделать может быть селектор или же просто вывести над списком все айдишники и при нажатии делать фильтрацию.
// Результат можно загрузить на GitHub или же GitLab.
// После выполнения тестового задания, направьте нам ссылку.
// Когда просмотрите задание, не могли бы вы сказать пожалуйста сколько вам примерно понадобится времени на его выполнение.
// Заранее спасибо за ответ!
// С уважением Анастасия!

interface Image {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

type ImageArray = Array<Image>;

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type ModalProps = {
  card: {
    title: string;
    url: string;
  };
  open: boolean;
  setOpen: (open: boolean) => void;
  setRenderModal: (renderModal: number) => void;
};

type PaginationProps = {
  count: number;
  setPage: (page: number) => void;
  page: number;
};

type SelectProps = {
  albumIds: number[];
  currentIdAlbum: number;
  setCurrentIdAlbum: (currentIdAlbum: number) => void;
  setShowAllAlbums: (showAllAlbums: boolean) => void;
  showAllAlbums: boolean;
  setPage: (currentPage: number) => void;
};

const PaginationRounded = (props: PaginationProps) => {
  const handleChange = (_: React.ChangeEvent<unknown>, page: number) => {
    props.setPage(page);
  };
  console.log(props);
  return (
    <Stack spacing={2}>
      <Pagination
        size="large"
        page={props.page}
        count={props.count}
        variant="outlined"
        shape="rounded"
        onChange={handleChange}
      />
    </Stack>
  );
};

const BasicModal = (props: ModalProps) => {
  const handleOpen = () => props.setOpen(true);
  const handleClose = () => {
    props.setOpen(false);
    props.setRenderModal(-1);
  };

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={props.open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <img src={props.card.url} alt={props.card.url} />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {props.card.title}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

const BasicSelect = (props: SelectProps) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    if (event.target.value === "all") {
      props.setShowAllAlbums(true);
    } else {
      props.setPage(1);
      props.setShowAllAlbums(false);
      props.setCurrentIdAlbum(parseInt(event.target.value));
    }
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Sort</InputLabel>
        <Select
          size="small"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={props.showAllAlbums ? "all" : "" + props.currentIdAlbum}
          label="Sort"
          onChange={handleChange}
        >
          <MenuItem value={"all"} key={"all"}>
            Show All
          </MenuItem>
          {props.albumIds.map((albumId: number) => (
            <MenuItem value={"" + albumId} key={albumId}>
              {`Id: ${albumId}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default function Album() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [renderModal, setRenderModal] = React.useState<number>(-1);
  const [images, setImages] = React.useState<ImageArray>([]);
  const [currentImages, setCurrentImages] = React.useState<ImageArray>(images);
  const [filteredImages, setFilteredImages] = React.useState<ImageArray>([]);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [albumIds, setAlbumIds] = React.useState<number[]>([]);
  const [currentIdAlbum, setCurrentIdAlbum] = React.useState<number>(1);
  const [showAllAlbums, setShowAllAlbums] = React.useState<boolean>(true);

  let perPage = 12;
  let offset = (currentPage - 1) * perPage;

  React.useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/photos")
      .then((v) => v.json())
      .then((data) => setImages(data));
  }, []);

  React.useEffect(() => {
    const albums = images.map((el) => el.albumId);
    setAlbumIds(Array.from(new Set(albums)));
  }, [images]);

  React.useEffect(() => {
    if (showAllAlbums) {
      setCurrentImages(images.slice(offset).slice(0, perPage));
    } else {
      setFilteredImages(images.filter((el) => el.albumId === currentIdAlbum));
      setCurrentImages(
        images
          .filter((el) => el.albumId === currentIdAlbum)
          .slice(offset)
          .slice(0, perPage)
      );
    }
  }, [currentPage, images, offset, perPage, currentIdAlbum, showAllAlbums]);

  const handleDelete = (id: number) => {
    setImages(images.filter((el) => el.id !== id));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        <Container sx={{ mt: 8 }} maxWidth="md">
          <Grid container justifyContent="center" gap={4}>
            <PaginationRounded
              page={currentPage}
              setPage={setCurrentPage}
              count={
                showAllAlbums
                  ? Math.ceil(images.length / perPage)
                  : Math.ceil(filteredImages.length / perPage)
              }
            />
            <BasicSelect
              setPage={setCurrentPage}
              albumIds={albumIds}
              currentIdAlbum={currentIdAlbum}
              setCurrentIdAlbum={setCurrentIdAlbum}
              showAllAlbums={showAllAlbums}
              setShowAllAlbums={setShowAllAlbums}
            />
          </Grid>
        </Container>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            {currentImages.map((card) => (
              <Grid item key={card.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    minHeight: "400px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {renderModal === card.id && (
                    <BasicModal
                      open={open}
                      setOpen={setOpen}
                      card={card}
                      setRenderModal={setRenderModal}
                    />
                  )}
                  <CardMedia
                    sx={{ height: "auto", aspectRatio: "1" }}
                    onClick={() => {
                      setRenderModal(card.id);
                      setOpen(!open);
                    }}
                    component="img"
                    image={card.thumbnailUrl}
                    alt={card.thumbnailUrl}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography>{card.title}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => {
                        handleDelete(card.id);
                      }}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  );
}
