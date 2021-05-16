package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MotoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Moto.class);
        Moto moto1 = new Moto();
        moto1.setId(1L);
        Moto moto2 = new Moto();
        moto2.setId(moto1.getId());
        assertThat(moto1).isEqualTo(moto2);
        moto2.setId(2L);
        assertThat(moto1).isNotEqualTo(moto2);
        moto1.setId(null);
        assertThat(moto1).isNotEqualTo(moto2);
    }
}
