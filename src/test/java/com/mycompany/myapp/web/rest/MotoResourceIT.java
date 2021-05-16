package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Moto;
import com.mycompany.myapp.repository.MotoRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MotoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MotoResourceIT {

    private static final String DEFAULT_COLOR = "AAAAAAAAAA";
    private static final String UPDATED_COLOR = "BBBBBBBBBB";

    private static final String DEFAULT_MODELO = "AAAAAAAAAA";
    private static final String UPDATED_MODELO = "BBBBBBBBBB";

    private static final String DEFAULT_MARCA = "AAAAAAAAAA";
    private static final String UPDATED_MARCA = "BBBBBBBBBB";

    private static final Instant DEFAULT_ANIO = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_ANIO = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Double DEFAULT_PRECIO = 1D;
    private static final Double UPDATED_PRECIO = 2D;

    private static final String ENTITY_API_URL = "/api/motos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MotoRepository motoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMotoMockMvc;

    private Moto moto;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Moto createEntity(EntityManager em) {
        Moto moto = new Moto().color(DEFAULT_COLOR).modelo(DEFAULT_MODELO).marca(DEFAULT_MARCA).anio(DEFAULT_ANIO).precio(DEFAULT_PRECIO);
        return moto;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Moto createUpdatedEntity(EntityManager em) {
        Moto moto = new Moto().color(UPDATED_COLOR).modelo(UPDATED_MODELO).marca(UPDATED_MARCA).anio(UPDATED_ANIO).precio(UPDATED_PRECIO);
        return moto;
    }

    @BeforeEach
    public void initTest() {
        moto = createEntity(em);
    }

    @Test
    @Transactional
    void createMoto() throws Exception {
        int databaseSizeBeforeCreate = motoRepository.findAll().size();
        // Create the Moto
        restMotoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(moto)))
            .andExpect(status().isCreated());

        // Validate the Moto in the database
        List<Moto> motoList = motoRepository.findAll();
        assertThat(motoList).hasSize(databaseSizeBeforeCreate + 1);
        Moto testMoto = motoList.get(motoList.size() - 1);
        assertThat(testMoto.getColor()).isEqualTo(DEFAULT_COLOR);
        assertThat(testMoto.getModelo()).isEqualTo(DEFAULT_MODELO);
        assertThat(testMoto.getMarca()).isEqualTo(DEFAULT_MARCA);
        assertThat(testMoto.getAnio()).isEqualTo(DEFAULT_ANIO);
        assertThat(testMoto.getPrecio()).isEqualTo(DEFAULT_PRECIO);
    }

    @Test
    @Transactional
    void createMotoWithExistingId() throws Exception {
        // Create the Moto with an existing ID
        moto.setId(1L);

        int databaseSizeBeforeCreate = motoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMotoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(moto)))
            .andExpect(status().isBadRequest());

        // Validate the Moto in the database
        List<Moto> motoList = motoRepository.findAll();
        assertThat(motoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMotos() throws Exception {
        // Initialize the database
        motoRepository.saveAndFlush(moto);

        // Get all the motoList
        restMotoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(moto.getId().intValue())))
            .andExpect(jsonPath("$.[*].color").value(hasItem(DEFAULT_COLOR)))
            .andExpect(jsonPath("$.[*].modelo").value(hasItem(DEFAULT_MODELO)))
            .andExpect(jsonPath("$.[*].marca").value(hasItem(DEFAULT_MARCA)))
            .andExpect(jsonPath("$.[*].anio").value(hasItem(DEFAULT_ANIO.toString())))
            .andExpect(jsonPath("$.[*].precio").value(hasItem(DEFAULT_PRECIO.doubleValue())));
    }

    @Test
    @Transactional
    void getMoto() throws Exception {
        // Initialize the database
        motoRepository.saveAndFlush(moto);

        // Get the moto
        restMotoMockMvc
            .perform(get(ENTITY_API_URL_ID, moto.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(moto.getId().intValue()))
            .andExpect(jsonPath("$.color").value(DEFAULT_COLOR))
            .andExpect(jsonPath("$.modelo").value(DEFAULT_MODELO))
            .andExpect(jsonPath("$.marca").value(DEFAULT_MARCA))
            .andExpect(jsonPath("$.anio").value(DEFAULT_ANIO.toString()))
            .andExpect(jsonPath("$.precio").value(DEFAULT_PRECIO.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingMoto() throws Exception {
        // Get the moto
        restMotoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewMoto() throws Exception {
        // Initialize the database
        motoRepository.saveAndFlush(moto);

        int databaseSizeBeforeUpdate = motoRepository.findAll().size();

        // Update the moto
        Moto updatedMoto = motoRepository.findById(moto.getId()).get();
        // Disconnect from session so that the updates on updatedMoto are not directly saved in db
        em.detach(updatedMoto);
        updatedMoto.color(UPDATED_COLOR).modelo(UPDATED_MODELO).marca(UPDATED_MARCA).anio(UPDATED_ANIO).precio(UPDATED_PRECIO);

        restMotoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMoto.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMoto))
            )
            .andExpect(status().isOk());

        // Validate the Moto in the database
        List<Moto> motoList = motoRepository.findAll();
        assertThat(motoList).hasSize(databaseSizeBeforeUpdate);
        Moto testMoto = motoList.get(motoList.size() - 1);
        assertThat(testMoto.getColor()).isEqualTo(UPDATED_COLOR);
        assertThat(testMoto.getModelo()).isEqualTo(UPDATED_MODELO);
        assertThat(testMoto.getMarca()).isEqualTo(UPDATED_MARCA);
        assertThat(testMoto.getAnio()).isEqualTo(UPDATED_ANIO);
        assertThat(testMoto.getPrecio()).isEqualTo(UPDATED_PRECIO);
    }

    @Test
    @Transactional
    void putNonExistingMoto() throws Exception {
        int databaseSizeBeforeUpdate = motoRepository.findAll().size();
        moto.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMotoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, moto.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(moto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Moto in the database
        List<Moto> motoList = motoRepository.findAll();
        assertThat(motoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMoto() throws Exception {
        int databaseSizeBeforeUpdate = motoRepository.findAll().size();
        moto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMotoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(moto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Moto in the database
        List<Moto> motoList = motoRepository.findAll();
        assertThat(motoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMoto() throws Exception {
        int databaseSizeBeforeUpdate = motoRepository.findAll().size();
        moto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMotoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(moto)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Moto in the database
        List<Moto> motoList = motoRepository.findAll();
        assertThat(motoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMotoWithPatch() throws Exception {
        // Initialize the database
        motoRepository.saveAndFlush(moto);

        int databaseSizeBeforeUpdate = motoRepository.findAll().size();

        // Update the moto using partial update
        Moto partialUpdatedMoto = new Moto();
        partialUpdatedMoto.setId(moto.getId());

        partialUpdatedMoto.color(UPDATED_COLOR).modelo(UPDATED_MODELO).marca(UPDATED_MARCA);

        restMotoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMoto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMoto))
            )
            .andExpect(status().isOk());

        // Validate the Moto in the database
        List<Moto> motoList = motoRepository.findAll();
        assertThat(motoList).hasSize(databaseSizeBeforeUpdate);
        Moto testMoto = motoList.get(motoList.size() - 1);
        assertThat(testMoto.getColor()).isEqualTo(UPDATED_COLOR);
        assertThat(testMoto.getModelo()).isEqualTo(UPDATED_MODELO);
        assertThat(testMoto.getMarca()).isEqualTo(UPDATED_MARCA);
        assertThat(testMoto.getAnio()).isEqualTo(DEFAULT_ANIO);
        assertThat(testMoto.getPrecio()).isEqualTo(DEFAULT_PRECIO);
    }

    @Test
    @Transactional
    void fullUpdateMotoWithPatch() throws Exception {
        // Initialize the database
        motoRepository.saveAndFlush(moto);

        int databaseSizeBeforeUpdate = motoRepository.findAll().size();

        // Update the moto using partial update
        Moto partialUpdatedMoto = new Moto();
        partialUpdatedMoto.setId(moto.getId());

        partialUpdatedMoto.color(UPDATED_COLOR).modelo(UPDATED_MODELO).marca(UPDATED_MARCA).anio(UPDATED_ANIO).precio(UPDATED_PRECIO);

        restMotoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMoto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMoto))
            )
            .andExpect(status().isOk());

        // Validate the Moto in the database
        List<Moto> motoList = motoRepository.findAll();
        assertThat(motoList).hasSize(databaseSizeBeforeUpdate);
        Moto testMoto = motoList.get(motoList.size() - 1);
        assertThat(testMoto.getColor()).isEqualTo(UPDATED_COLOR);
        assertThat(testMoto.getModelo()).isEqualTo(UPDATED_MODELO);
        assertThat(testMoto.getMarca()).isEqualTo(UPDATED_MARCA);
        assertThat(testMoto.getAnio()).isEqualTo(UPDATED_ANIO);
        assertThat(testMoto.getPrecio()).isEqualTo(UPDATED_PRECIO);
    }

    @Test
    @Transactional
    void patchNonExistingMoto() throws Exception {
        int databaseSizeBeforeUpdate = motoRepository.findAll().size();
        moto.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMotoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, moto.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(moto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Moto in the database
        List<Moto> motoList = motoRepository.findAll();
        assertThat(motoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMoto() throws Exception {
        int databaseSizeBeforeUpdate = motoRepository.findAll().size();
        moto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMotoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(moto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Moto in the database
        List<Moto> motoList = motoRepository.findAll();
        assertThat(motoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMoto() throws Exception {
        int databaseSizeBeforeUpdate = motoRepository.findAll().size();
        moto.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMotoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(moto)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Moto in the database
        List<Moto> motoList = motoRepository.findAll();
        assertThat(motoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMoto() throws Exception {
        // Initialize the database
        motoRepository.saveAndFlush(moto);

        int databaseSizeBeforeDelete = motoRepository.findAll().size();

        // Delete the moto
        restMotoMockMvc
            .perform(delete(ENTITY_API_URL_ID, moto.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Moto> motoList = motoRepository.findAll();
        assertThat(motoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
